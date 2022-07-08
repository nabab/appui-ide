<?php
use bbn\X;
$cfg = [
  'tables' => ['o1' => 'bbn_options'],
  'fields' => ['o2.code', 'o1.text'],
  'join' => [
    [
      'table' => 'bbn_options',
      'alias' => 'o2',
      'on' => [
         [
            'field' => 'o1.id_parent',
            'exp' => 'o2.id',
            'operator' => '=' //optional, it is equal by default
         ]
       ]
    ]
  ],
  'where' => [
     'o1.code' => 'appui',
     'o2.id_parent' => null
  ]
];

bbn\appui\history::disable();
$ctrl->db->rselectAll($cfg);
$q1 = $ctrl->db->last();
bbn\appui\history::enable();
$ctrl->db->rselectAll($cfg);
$q2 = $ctrl->db->last();
X::hdump($q1, $q2);
