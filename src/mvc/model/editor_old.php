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
          'text' => '<i class="fas fa-plus"></i>New',
          'items' => [[
            'text' => '<i class="far fa-file"></i>File',
            'function' => "bbn.ide.newFile()"
          ], [
            'text' => '<i class="fas fa-folder"></i>Directory',
            'function' => "bbn.ide.newDir()"
          ]]
        ], [
          'text' => '<i class="fas fa-save"></i>Save',
          'function' => "bbn.ide.save();"
        ], [
          'text' => '<i class="far fa-trash-alt"></i>Delete',
        ], [
          'text' => '<i class="fas fa-times-circle"></i>Close',
          'function' => "bbn.ide.tabstrip.tabNav('close');"
        ], [
          'text' => '<i class="far fa-times-circle"></i>Close all tabs',
          'function' => "bbn.ide.tabstrip.tabNav('closeAll');"
        ]]
      ], [
        'text' => 'Edit',
        'items' => [[
          'text' => '<i class="fas fa-search"></i>Find <small>CTRL+F</small>',
          'function' => "bbn.ide.search();"
        ], [
          'text' => '<i class="fas fa-search-plus"></i>Find next <small>CTRL+G</small>',
          'function' => "bbn.ide.findNext();"
        ], [
          'text' => '<i class="fas fa-search-minus"></i>Find previous <small>SHIFT+CTRL+G</small>',
          'function' => "bbn.ide.findPrev();"
        ], [
          'text' => '<i class="fas fa-exchange-alt"></i>Replace <small>SHIFT+CTRL+F</small>',
          'function' => "bbn.ide.replace();"
        ], [
          'text' => '<i class="fas fa-retweet"></i>Replace All <small>SHIFT+CTRL+R</small>',
          'function' => "bbn.ide.replaceAll();"
        ]]
      ], [
        'text' => 'History',
        'items' => [[
          'text' => '<i class="fas fa-history"></i>Show',
          'function' => 'bbn.ide.history();'
        ], [
          'text' => '<i class="far fa-trash-alt"></i>Clear',
          'function' => 'bbn.ide.historyClear();'
        ], [
          'text' => '<i class="fas fa-trash"></i>Clear All',
          'function' => 'bbn.ide.historyClearAll();'
        ]]
      ], [
        'text' => 'Doc.',
        'items' => [[
          'text' => '<i class="fas fa-binoculars"></i>Find',
        ], [
          'text' => '<i class="fas fa-book"></i>Generate',
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
          'text' => '<i class="fas fa-cog"></i>Manage directories',
          'function' => "bbn.ide.cfgDirs();"
        ], [
          'text' => '<i class="fas fa-language"></i>IDE style',
          'function' => "bbn.ide.cfgStyle();"
        ]]
      ]
    ]
  ];
}