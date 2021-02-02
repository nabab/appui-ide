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
$nc = new \bbn\Api\Nextcloud($cfg);
var_dump($nc->exists('3square.png'), $nc->exists('tost/cami'), $nc->exists('tost/thomas'), $nc->getError());
/** @var $ctrl \bbn\Mvc\Controller */
$req = \bbn\X::join($ctrl->arguments, DIRECTORY_SEPARATOR);
$root = false;
foreach ( $ctrl->getRoutes() as $r ){
  if ( \bbn\X::indexOf($req, $r['url'].DIRECTORY_SEPARATOR) === 0 ){
    $root = $r['path'];
  }
}
$repos = $ctrl->inc->ide->getRepositories();
\bbn\X::hdump($req, $root, $repos);