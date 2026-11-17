import test from 'node:test';
import assert from 'node:assert/strict';
import {renderReviews} from '../integrations/render-reviews.js';
test('reviews section stays absent without approved public feedback',()=>{
  assert.equal(renderReviews([]),'');
  assert.equal(renderReviews([{name:'Example',quote:'Test only',kind:'membership',approved:true}]),'');
});
test('review rendering escapes text and labels the source experience',()=>{
  const html=renderReviews([{name:'<Example>',quote:'Test <script> only',kind:'private-class',approved:true,consentToPublish:true}]);
  assert.ok(html.includes('Private Arabic lessons with Hapi'));
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(!html.includes('<script>'));
  assert.ok(!html.includes('Álquimia membership'));
});
