<?php
/*
 * Describe what it does!
 *
 **/

/** @var $this \bbn\mvc\controller */

$fs = new \bbn\file\system();
var_dump("HELLO", \bbn\str::say_size($fs->dirsize(BBN_DATA_PATH.'test')));