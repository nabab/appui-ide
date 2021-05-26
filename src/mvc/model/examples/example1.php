<?php

use bbn\X;
use bbn\Str;

/** @var $model \bbn\Mvc\Model*/

// Models should always return an associative array
return [
  "myTitle" => "I come from the model!",
  "countries" => [
    ["country" => "Egypt"],
    ["country" => "Italy"],
    ["country" => "France"]
  ]
];

