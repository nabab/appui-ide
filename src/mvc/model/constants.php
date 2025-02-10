<?php
/** @var bbn\Mvc\Model $model */
$data = ['names' => []];
$prefs = [strtoupper(BBN_APP_PREFIX), 'BBN'];
foreach ( $prefs as $i => $p ){
  $cs = get_defined_constants();
  $res = [
    'prefix' => $p,
    'constants' => []
  ];
  $prefix = $p.'_';
  foreach ( $cs as $k => $c ){
    if ( strpos($k, $prefix) === 0 ){
      array_push($res['constants'], [
        'constant' => substr($k, strlen($prefix)),
        'value' => $c
      ]);
    }
  }
  $data['names'][] = $res;
}
return $data;