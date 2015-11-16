<?php
$dirs = new \bbn\ide\directories($this->db);
$res = [
  'default_dir' => isset($_SESSION[BBN_SESS_NAME]['ide']['dir']) ? $_SESSION[BBN_SESS_NAME]['ide']['dir'] : 'MVC',
  'dirs' => $dirs->dirs(),
  'modes' => $dirs->modes(),
  'menu' => [
    [
      'text' => 'New',
      'items' => [[
        'text' => 'Directory',
        'function' => "appui.f.IDE.newDir()"
      ]]
    ], [
      'text' => 'File',
      'items' => [[
        'text' => 'Save',
        'function' => "appui.f.IDE.save();"
      ], [
        'text' => 'Delete',
      ], [
        'text' => 'Duplicate',
      ], [
        'text' => 'Search',
      ]]
    ], [
      'text' => 'Code',
      'items' => [[
        'text' => 'Find <small>CTRL+F</small>',
        'function' => "appui.f.IDE.search();"
      ], [
        'text' => 'Find next <small>CTRL+G</small>',
        'function' => "appui.f.IDE.findNext();"
      ], [
        'text' => 'Find previous <small>SHIFT+CTRL+G</small>',
        'function' => "appui.f.IDE.findPrev();"
      ], [
        'text' => 'Replace <small>SHIFT+CTRL+F</small>',
        'function' => "appui.f.IDE.replace();"
      ], [
        'text' => 'Replace All <small>SHIFT+CTRL+R</small>',
        'function' => "appui.f.IDE.replaceAll();"
      ], [
        'text' => 'Test! <small>SHIFT+CTRL+T</small>',
        'function' => "appui.f.IDE.test();"
      ]]
    ], [
      'text' => 'Documentation',
      'items' => [[
        'text' => 'Find',
      ], [
        'text' => 'Generate',
      ]]
    ], [
      'text' => 'Current',
      'items' => [[
        'text' => 'Add View',
      ], [
        'text' => 'Add Model',
      ], [
        'text' => 'Remove current',
      ]]
    ], [
      'text' => 'Preferences',
      'items' => [[
        'text' => 'Manage directories',
        'function' => "appui.f.IDE.cfgDirs();"
      ], [
        'text' => 'IDE style',
        'function' => "appui.f.IDE.cfgStyle();"
      ]]
    ]
  ]
];
foreach ( $res['dirs'] as $name => $d ){
  array_push($res['menu'][0]['items'], [
  	'text' => $d['name'],
    'function' => "appui.f.IDE.newFile('$name')"
  ]);
}

return $res;