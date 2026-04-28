<?php
/** @var bbn\Mvc\Controller $ctrl */
use bbn\X;

$a = [[
  'a' => '2026-04-17',
  'b' => '2025-12-31'
], [
  'a' => '2024-04-01',
  'b' => '2023-12-31'
], [
  'a' => '2024-10-17',
  'b' => '2023-12-31'
]];
X::sortBy($a, [[
  'field' => 'b',
  'dir' => 'desc'
], [
  'field' => 'a',
  'dir' => 'desc'
]]);
X::hdump($a);

//$ctrl->combo(_("Service worker management"));