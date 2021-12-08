<?php

/** @var $this \bbn\Mvc\Controller */
$db = new \bbn\Db([
  'engine' => 'sqlite',
  'db' => BBN_CDN_DB
]);
$lib = new \bbn\Cdn\Library($db);
$lib->add('bbnjs|latest|jeans');
\bbn\X::hdump($lib->getConfig());