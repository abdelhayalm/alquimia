/* Álquimia signup receiver. Deploy separately in the owner's Google account.
 * Script properties: SPREADSHEET_ID, SIGNUP_SHARED_SECRET (same secret as Cloudflare).
 * This endpoint can append signed signups. It never exposes or lists client records.
 */
var HEADERS = ['Signup ID', 'Signup date (UTC)', 'Name', 'Email', 'Country', 'Session language', 'Membership', 'Currency', 'Amount', 'Payment provider', 'Payment status', 'Payment reference', 'NAS.com access', 'Access date (UTC)', 'Notes'];

function output_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
function hex_(bytes) { return bytes.map(function(byte) { return ('0' + (byte & 255).toString(16)).slice(-2); }).join(''); }
function equal_(a,b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  var mismatch = 0;
  for (var i=0;i<a.length;i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}
function safeText_(value) {
  var string = String(value == null ? '' : value);
  // Names/emails must stay literal text even if a spreadsheet treats =, +, - or @ specially.
  return /^[\s]*[=+\-@]/.test(string) ? "'" + string : string;
}
function doGet() { return output_({service:'Alquimia signup receiver'}); }

function doPost(event) {
  var lock;
  try {
    if (!event || !event.postData || event.postData.contents.length > 10000) return output_({code:'invalid_request'});
    var envelope = JSON.parse(event.postData.contents);
    var props = PropertiesService.getScriptProperties();
    var secret = props.getProperty('SIGNUP_SHARED_SECRET');
    var sheetId = props.getProperty('SPREADSHEET_ID');
    if (!secret || secret.length < 32 || !sheetId) return output_({code:'not_configured'});
    if (typeof envelope.payload !== 'string' || envelope.payload.length > 6000) return output_({code:'invalid_request'});
    var signature = hex_(Utilities.computeHmacSha256Signature(envelope.payload,secret,Utilities.Charset.UTF_8));
    if (!equal_(envelope.signature,signature)) return output_({code:'unauthorized'});
    var message = JSON.parse(envelope.payload);
    if (typeof message.sentAt !== 'number' || Math.abs(Date.now()-message.sentAt)>300000 || !/^[a-f0-9]{64}$/.test(message.rateKey)) return output_({code:'expired'});
    var record = message.record;
    if (!record || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(record.signupId)) return output_({code:'invalid_request'});
    if (!['monthly','annual'].includes(record.membership) || !['USD','BRL'].includes(record.currency) || !['English','Português'].includes(record.language)) return output_({code:'invalid_request'});
    if (typeof record.name!=='string' || !record.name || record.name.length>100 || typeof record.email!=='string' || record.email.length>254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.email) || !/^[A-Z]{2}$/.test(record.country)) return output_({code:'invalid_request'});
    var expected = record.currency === 'USD' ? (record.membership === 'annual' ? 250 : 25) : (record.membership === 'annual' ? 1345 : 135);
    if (record.amount !== expected || record.provider !== (record.currency === 'USD' ? 'Stripe' : 'InfinitePay')) return output_({code:'invalid_request'});
    var submitted = new Date(record.createdAt);
    if (isNaN(submitted.getTime()) || Math.abs(submitted.getTime()-message.sentAt)>300000) return output_({code:'invalid_request'});
    lock = LockService.getScriptLock();
    if (!lock.tryLock(5000)) return output_({code:'busy'});
    var sheet = SpreadsheetApp.openById(sheetId).getSheetByName('Clients');
    if (!sheet || sheet.getRange(1,1,1,HEADERS.length).getValues()[0].join('\u001f') !== HEADERS.join('\u001f')) return output_({code:'schema_mismatch'});
    var last = sheet.getLastRow();
    var found = last>1 ? sheet.getRange(2,1,last-1,1).createTextFinder(record.signupId).matchEntireCell(true).findNext() : null;
    if (found) {
      var previous = sheet.getRange(found.getRow(),1,1,HEADERS.length).getValues()[0];
      // Repeating a saved request is safe. Never overwrite payment or NAS.com status.
      if (previous[2]!==safeText_(record.name).replace(/^'/,'') && previous[2]!==safeText_(record.name)) return output_({code:'id_conflict'});
      if (previous[3]!==safeText_(record.email).replace(/^'/,'') && previous[3]!==safeText_(record.email)) return output_({code:'id_conflict'});
      if (previous[4]!==record.country || previous[5]!==record.language || previous[6]!==record.membership || previous[7]!==record.currency || previous[8]!==record.amount) return output_({code:'id_conflict'});
      return output_({saved:true,signupId:record.signupId});
    }
    // Quota limits are intentionally independent of payment status. IP addresses are never stored.
    var cache = CacheService.getScriptCache();
    var bucket = Math.floor(Date.now()/600000);
    var visitorKey = 'v:' + message.rateKey + ':' + bucket;
    var globalKey = 'g:' + bucket;
    var count = Number(cache.get(visitorKey)||0);
    var total = Number(cache.get(globalKey)||0);
    if (count>=5 || total>=100) return output_({code:'rate_limited'});
    cache.put(visitorKey,String(count+1),650);
    cache.put(globalKey,String(total+1),650);
    if (last+1>sheet.getMaxRows()) sheet.insertRowsAfter(sheet.getMaxRows(),100);
    var row = last+1;
    var values = [safeText_(record.signupId),submitted,safeText_(record.name),safeText_(record.email),record.country,record.language,record.membership,record.currency,record.amount,record.provider,'Awaiting confirmation','','Not invited','',''];
    sheet.getRange(row,1,1,HEADERS.length).setValues([values]);
    sheet.getRange(row,2).setNumberFormat('yyyy-mm-dd hh:mm');
    sheet.getRange(row,9).setNumberFormat('#,##0.00');
    SpreadsheetApp.flush();
    return output_({saved:true,signupId:record.signupId});
  } catch (error) {
    // Do not return exception details, spreadsheet identifiers, or customer data.
    return output_({code:'save_failed'});
  } finally { if (lock && lock.hasLock()) lock.releaseLock(); }
}
