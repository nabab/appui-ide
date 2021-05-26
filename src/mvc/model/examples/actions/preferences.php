<?php
//Get class configuration
$classCfg = $model->inc->pref->getClassCfg();
$tables = $classCfg['tables'];
$prefFields = $classCfg['arch'][$tables['user_options']];
$bitsFields = $classCfg['arch'][$tables['user_options_bits']];

// Insert an user preference of an option
$prefID = $model->inc->pref->add($model->inc->options->fromCode('cnn', 'list', 'news', 'appui'), [
  $prefFields['text'] => 'CNN RSS'
]);

// Update an user preference of an option
$model->inc->pref->update($prefID, [
  $prefFields['text'] => 'CNN RSS Feed'
]);
// Alternative for the text field
$model->inc->pref->setText($prefID, 'CNN RSS Feed');


// Add bits
$bitID1 = $model->inc->pref->addBit($prefID, [
  $bitsFields['text'] => 'CNN RSS Feed US',
  $bitsFields['num'] => 1,
  'url' => 'http://rss.cnn.com/rss/edition_us.rss',
  'shortcode' => 'us'
]);
$bitID2 = $model->inc->pref->addBit($prefID, [
  $bitsFields['text'] => 'CNN RSS Feed Asia',
  $bitsFields['num'] => 2,
  'url' => 'http://rss.cnn.com/rss/edition_asia.rss',
  'shortcode' => 'asia'
]);

// Update a bit
$model->inc->pref->updateBit($bitID2, [
  $bitsFields['text'] => 'CNN RSS Feed Africa',
  'url' => 'http://rss.cnn.com/rss/edition_africa.rss',
  'shortcode' => 'africa'
]);

// Delete a bit
$model->inc->pref->deleteBit($bitID1);

// Delete a preference
$model->inc->pref->delete($prefID);

return [
  'data' => [
    'prefID' => $prefID,
    'bitID1' => $bitID1,
    'bitID2' => $bitID2
  ]
];