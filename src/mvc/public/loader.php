<?php
/*
 * Describe what it does!
 *
 **/

$cfg = [
  'host' => 'cloud.bbn.so',
  'user' => 'bbn',
  'pass' => 'bbnsolutionstest'
];
$nc = new \bbn\api\nextcloud($cfg);
var_dump($nc->exists('3square.png'), $nc->exists('tost/cami'), $nc->exists('tost/thomas'), $nc->get_error());
/** @var $ctrl \bbn\mvc\controller */
$req = \bbn\x::join($ctrl->arguments, DIRECTORY_SEPARATOR);
$root = false;
foreach ( $ctrl->get_routes() as $r ){
  if ( \bbn\x::indexOf($req, $r['url'].DIRECTORY_SEPARATOR) === 0 ){
    $root = $r['path'];
  }
}
$repos = $ctrl->inc->ide->repositories();
\bbn\x::hdump($req, $root, $repos);