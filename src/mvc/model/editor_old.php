<?php
/** @var $model \bbn\mvc\model */
if ( isset($model->data['routes']) ){

  $dirs = new \bbn\ide\directories($model->inc->options, $model->data['routes']);

  return [
    'default_dir' => $model->inc->session->has('ide', 'dir') ?
      $model->inc->session->get('ide', 'dir') :
      'BBN_APP_PATH/mvc/',
    'dirs' => $dirs->dirs(),
    'modes' => $dirs->modes(),
    'menu' => [
      [
        'text' => 'File',
        'items' => [[
          'text' => '<i class="fa fa-plus"></i>New',
          'items' => [[
            'text' => '<i class="far fa-file"></i>File',
            'function' => "bbn.ide.newFile()"
          ], [
            'text' => '<i class="fa fa-folder"></i>Directory',
            'function' => "bbn.ide.newDir()"
          ]]
        ], [
          'text' => '<i class="fa fa-save"></i>Save',
          'function' => "bbn.ide.save();"
        ], [
          'text' => '<i class="far fa-trash-alt"></i>Delete',
        ], [
          'text' => '<i class="fa fa-times-circle"></i>Close',
          'function' => "bbn.ide.tabstrip.tabNav('close');"
        ], [
          'text' => '<i class="far fa-times-circle"></i>Close all tabs',
          'function' => "bbn.ide.tabstrip.tabNav('closeAll');"
        ]]
      ], [
        'text' => 'Edit',
        'items' => [[
          'text' => '<i class="fa fa-search"></i>Find <small>CTRL+F</small>',
          'function' => "bbn.ide.search();"
        ], [
          'text' => '<i class="fa fa-search-plus"></i>Find next <small>CTRL+G</small>',
          'function' => "bbn.ide.findNext();"
        ], [
          'text' => '<i class="fa fa-search-minus"></i>Find previous <small>SHIFT+CTRL+G</small>',
          'function' => "bbn.ide.findPrev();"
        ], [
          'text' => '<i class="fa fa-exchange"></i>Replace <small>SHIFT+CTRL+F</small>',
          'function' => "bbn.ide.replace();"
        ], [
          'text' => '<i class="fa fa-retweet"></i>Replace All <small>SHIFT+CTRL+R</small>',
          'function' => "bbn.ide.replaceAll();"
        ]]
      ], [
        'text' => 'History',
        'items' => [[
          'text' => '<i class="fa fa-history"></i>Show',
          'function' => 'bbn.ide.history();'
        ], [
          'text' => '<i class="far fa-trash-alt"></i>Clear',
          'function' => 'bbn.ide.historyClear();'
        ], [
          'text' => '<i class="fa fa-trash"></i>Clear All',
          'function' => 'bbn.ide.historyClearAll();'
        ]]
      ], [
        'text' => 'Doc.',
        'items' => [[
          'text' => '<i class="fa fa-binoculars"></i>Find',
        ], [
          'text' => '<i class="fa fa-book"></i>Generate',
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
          'text' => '<i class="fa fa-cog"></i>Manage directories',
          'function' => "bbn.ide.cfgDirs();"
        ], [
          'text' => '<i class="fa fa-language"></i>IDE style',
          'function' => "bbn.ide.cfgStyle();"
        ]]
      ]
    ]
  ];
}