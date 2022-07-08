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





<?php
/*
 * This is the model file. From here you can
 * interact with options and user preferences.
 * Both can have whatever property you please.
 * Each preference is connected to an option.
 * You can add more preferences for the same option.
 * You will find below a few examples.
 */

use bbn\X;
use bbn\Str;

// The option ID which corresponds to a list of News
$idList = $model->inc->options->fromCode('list', 'news', 'appui');
// The option ID which corresponds to the category of News
$idCat = $model->inc->options->fromCode('cat', 'news', 'appui');

/*
OPTIONS EXAMPLES

// Retrieve options
$categories = $model->inc->options->fullOptions($idCat);

// Inserts a new option: id_parent and text are mandatory
$optID = $model->inc->options->add(
  [
    'id_parent' => $idCat,
    'text' => 'My new category',
    'whatever' => 'property',
    'code' => 'new_cat'
  ]
);

// Updates an option
$success = $model->inc->options->set(
  $optID,
  [
    'text' => 'My new category 2',
    'whatever' => 'property',
    'whatever2' => 'property2',
    'code' => 'new_cat'
  ]
);

// Deletes an option
$model->inc->options->remove($optID);

USER PREFERENCES EXAMPLES

// Retrieves an array of preferences for the given option
$myPrefs = $model->inc->pref->getAll($idCat)

// Inserts a preference
$prefID = $model->inc->pref->addToGroup(
	$idList,
  [
    'text' => 'CNN US',
    'url' => 'http://rss.cnn.com/rss/edition_us.rss',
    'shortcode' => 'cnn_us'
  ]
);

// Updates a preference
$model->inc->pref->update(
  $prefID,
  [
  	'text' => 'CNN RSS Feed'
	]
);

// Deletes a preference
$model->inc->pref->delete($prefID);

MODEL EXAMPLE
// At the end of the model you should return an associative array
return [
  'data' => [
    'optionId' => $optID,
    'categoryId' => $idCat,
    'categoriesList' => $categories
  ]
];

IT REALLY STARTS FROM HERE
*/

/** @var $model \bbn\Mvc\Model */
if ($model->hasData('category')) {
  // Do actions depending on the data sent
  return [
    'success' => false
  ];
}
else {
  // Default returns the data for the view
  $categories = $model->inc->options->textValueOptions($idCat);
  try {
    $xml = X::curl('http://rss.cnn.com/rss/edition_europe.rss', null, []);
  }
  catch (Exception $e) {
    return [
      'xml' => $e->getMessage()
    ];
  }
  return [
    'id_list' => $idList,
    'id_cat' => $idCat,
    'categories' => $categories,
    'xml' => $xml
  ];
}
