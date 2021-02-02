<?php
/*
 * Describe what it does!
 *
 **/

/** @var $this \bbn\Mvc\Controller */

$fs = new \bbn\File\System();
var_dump("HELLO", \bbn\Str::saySize($fs->dirsize(BBN_DATA_PATH.'test')));