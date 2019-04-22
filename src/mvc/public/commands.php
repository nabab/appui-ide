<?php
/*
 * Describe what it does!
 *
 **/

/** @var $this \bbn\mvc\controller */
$db = new \bbn\db([
  'engine' => 'sqlite',
  'db' => BBN_CDN_DB
]);
$lib = new \bbn\cdn\library($db);
$lib->add('bbnjs|latest|jeans');
\bbn\x::hdump($lib->get_config());