<?php
$dirs = new \bbn\ide\directories($this->inc->options);
$res = [
  'default_dir' => $this->inc->session->has('ide', 'dir') ? $this->inc->session->get('ide', 'dir') : 'main_mvc/php',
  'dirs' => $dirs->dirs(),
  'modes' => $dirs->modes(),
  'menu' => [
    [
      'text' => 'New',
      'items' => [[
        'text' => 'Directory',
        'function' => "appui.ide.newDir()"
      ]]
    ], [
      'text' => 'File',
      'items' => [[
        'text' => 'Save',
        'function' => "appui.ide.save();"
      ], [
        'text' => 'Delete',
      ], [
        'text' => 'Duplicate',
      ], [
        'text' => 'Search',
      ], [
        'text' => 'Close',
        'function' => "appui.ide.tabstrip.tabNav('close');"
      ], [
        'text' => 'Close all tabs',
        'function' => "appui.ide.tabstrip.tabNav('closeAll');"
      ]]
    ], [
      'text' => 'Edit',
      'items' => [[
        'text' => 'Find <small>CTRL+F</small>',
        'function' => "appui.ide.search();"
      ], [
        'text' => 'Find next <small>CTRL+G</small>',
        'function' => "appui.ide.findNext();"
      ], [
        'text' => 'Find previous <small>SHIFT+CTRL+G</small>',
        'function' => "appui.ide.findPrev();"
      ], [
        'text' => 'Replace <small>SHIFT+CTRL+F</small>',
        'function' => "appui.ide.replace();"
      ], [
        'text' => 'Replace All <small>SHIFT+CTRL+R</small>',
        'function' => "appui.ide.replaceAll();"
      ]]
    ], [
      'text' => 'Doc.',
      'items' => [[
        'text' => 'Find',
      ], [
        'text' => 'Generate',
      ]]
    ], /*[
      'text' => 'Current',
      'items' => [[
        'text' => 'Add View',
      ], [
        'text' => 'Add Model',
      ], [
        'text' => 'Remove current',
      ]]
    ], */[
      'text' => 'Pref.',
      'items' => [[
        'text' => 'Manage directories',
        'function' => "appui.ide.cfgDirs();"
      ], [
        'text' => 'IDE style',
        'function' => "appui.ide.cfgStyle();"
      ]]
    ]
  ]
];
foreach ( $res['dirs'] as $name => $d ){
  array_push($res['menu'][0]['items'], [
    'text' => $d['text'],
    'function' => "appui.ide.newFile('$name')"
  ]);
}

return $res;
