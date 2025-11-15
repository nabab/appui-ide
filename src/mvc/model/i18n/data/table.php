<?php
/**
 * created by loredana bruno.
 * user: bbn
 * date: 25/04/18
 * time: 12.46
 */

use bbn\Str;
use bbn\Mvc;
use bbn\Appui\I18n;

/** @todo disable the i18n button if $model->data['data']['file_name'] doesn't exist */
if ( $model->data['table_path'] !== '' ){
  $table_path = $model->data['table_path'].'/';
}
else {
  $table_path  = '';
}




/** checking isset(table_path) i also take file at root */
if (
  ( $repository = $model->data['repository'] ) &&
  ( $file_name = $model->data['file_name'] ) &&
  isset( $table_path )
){
  $success = false;
  $lang = $repository['language'];
  /** instantiate i18n class */
  $translation = new I18n($model->db);



  /** @var  $partial_path join to the path of the parent the path of the current repository */
  $partial_path = $repository['bbn_path'] === 'BBN_APP_PATH' ? Mvc::getAppPath() : constant($repository['bbn_path']);
  $partial_path .= $repository['path'];

  /** @var (array) $paths will be fill with the path to explore */
  $paths = [];
  $files = [];

  /** case mvc */
  if ( !empty($repository['tabs']) ){
    /** @var (array) $dir_name takes the name of dir to explore */
    $dir_name = [];
    $extensions = [];
    foreach ( $repository['tabs'] as $t => $val ) {
      $extensions[$val['path']] = $repository['tabs'][$t]['extensions'];
      /** don't take _ctrl that has the same path of public */
      if ( Str::sub($val['url'], 0, 1) !== '_' ){
        $dir_name[$val['path']] = $partial_path . $val['path'];
      }

    }
    foreach ( $dir_name as $d => $value){
      if ( $model->inc->fs->isDir($dir_name[$d].$table_path) && !empty($extensions) ) {

        /** @var loop on the extensions of each tab to check if a file exist with this filename and this extension */
        $file = '';
        foreach ( $extensions[$d] as $idx => $v){

          /** look for the first extension then exit from the loop */
          /** if the file with this extension exist it put it into an array  */

          if ( $model->inc->fs->exists($dir_name[$d] . $table_path . $file_name . '.' . $extensions[$d][$idx]['ext']) ){
            $file = $dir_name[$d] . $table_path . $file_name . '.' . $extensions[$d][$idx]['ext'];

            if ( !in_array( $file, $files ) ){
              $files[] = [
                'file' => $file,
                'strings' => []
              ];
            }
            break;
          }
        }


      }

    }

  }
  /** case not MVC */
  elseif ( empty($repository['tabs']) ){
    $files[] = [
      'file' => $partial_path . $model->data['path'] . $table_path . $file_name . '.' . $model->data['ext'],
      'strings' => []
    ];
  }

  /** @var (array) $strings will be filled with strings found in files*/
  $strings  = [];
  $langs = [];
  foreach ( $files as $idx => $f ) {
    if ( $translation->analyzeFile($files[$idx]['file']) ){
      /** array of strings in each file */

      $files[$idx]['strings'] = $translation->analyzeFile($files[$idx]['file']);


      /** @var array $langs will be fill with langs of translations found in db for strings of this file*/


      foreach ( $files[$idx]['strings'] as $i => $string ){
        if ( $id = $model->db->selectOne('bbn_i18n', 'id', [
          'exp' => $string,
          'lang'=> $lang
        ]) ){
          $files[$idx]['strings'][$i] = [
            'original_exp' => $string,
            'file' => $model->inc->ide->realToUrl($files[$idx]['file']),
            'id_exp' => $id,
            'original_lang' => $lang,
          ];
          /** takes the translations from  bbn_i18n_exp */
          if( $rows = $model->db->rselectAll('bbn_i18n_exp', ['expression', 'lang'], [
              'id_exp' => $id
            ]
          )){
            foreach( $rows as $index => $r){
              if ( !in_array($rows[$index]['lang'], $langs) ){
                $langs[] = $rows[$index]['lang'];
              }
              $files[$idx]['strings'][$i][$r['lang']] = $r['expression'];
            }

          }
          $strings[] = $files[$idx]['strings'][$i];

        }
      }
    }
  }
  $success = true;
  return [
    'id_option' => $repository['id'],
    'i18n' => $model->pluginUrl('appui-i18n').'/',
    'langs' => $langs,
    'primary' => $translation->getPrimariesLangs(),
    'files' => $files,
    'data' => $strings,
    'success'=> $success
  ];
}