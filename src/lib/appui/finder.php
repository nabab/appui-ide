<?php
/**
 * Created by PhpStorm.
 * User: BBN
 * Date: 08/02/2019
 * Time: 17:17
 */

namespace appui;


class finder
{

  protected $fs;

  public function __construct(\bbn\file\system $fs)
  {
    $this->fs = $fs;
  }
  public function get_info_dir()
  {
    $info_dir = []; 
    $num_files = 0;
    $num_dirs = 0;
    $files = array_filter($this->get_data(), function($a){
      return $a['file'] === true;
    });
    if ( !empty($files) ){
      $num_files = count($files);
    };
    $dirs = array_filter($this->get_data(),function($a){
      return $a['dir'] === true;
    });
    if ( !empty($dirs) ){
      $num_dirs = count($dirs);
    };
    $info_dir = [ 
      'num_files' => $num_files,
      'num_dirs' => $num_dirs
    ];
    return $info_dir;
  }
  public function get_data()
  {
   // die(var_dump('here',$this->fs->get_files('.', true, true, null, '')));
    $data = array_map(function($a){
      return [
        'icon' => $this->get_icon($a['file'] ? $a['path'] : 'dir'),
        'text' => $a['path'],
        'value' => $a['path'],
        'dir' => $a['dir'],
        'file' => $a['file']
      ];
    }, $this->fs->get_files('.', true, true, null, 't'));
    return $data;
  }
  public function is_img(string $ext)
  {
    $res = false;
    switch ($ext){
      case '.gif':
      case '.svg':
      case '.png':
      case '.jpeg':
      case '.jpg':
        $res = true;
    }
    return $res;
  }

  public function is_readable($ext)
  {
    $res = false;
    switch ( $ext ){
      case '.csv':
      case '.html':
      case '.xml':
      case '.js':
      case '.php':
      case '.css':
      case '.json':
      case '.less':
      case '.txt':
      case '.log':
      case '.cert':
      case '.cer':
        $res =  true;
      break;
      
      case '.xlsx':
      case '.ods':
      case '.xsl':
      case '.xlt':
      case '.xltm':
      case '.doc':
      case '.dot':
      case '.wbk':
      case '.docx':
      case '.dotx':
      case '.docb':
      case '.zip':
      case '.pdf':
        $res =  false;
        break;
    }
  return $res;  
  }
  

  public function get_image_infos($path){
    $i = new \bbn\file\image($path);
    $info = [
      'height' => $i->get_height(),
      'width' =>  $i->get_width(),
    ];
    return $info;  
  }
  public function get_info($path, $ext)
  {
    $info = [];
    if ( $this->fs->exists($path) ){
    $info['size'] = \bbn\str::say_size($this->fs->filesize($path));
    $info['mtime'] = \bbn\date::format(filemtime($path));
    $info['creation'] = \bbn\date::format(filectime($path));;
    if ( !empty($ext) ){
      if ( $this->is_img($ext) ){
        $info['is_image'] = true;
        $info['image'] = $this->get_image_infos($path);
      }
      /*else if ( empty($this->is_img($ext)) ){
        $info['is_image'] = false;
      } */
      else if ( empty($this->is_img($ext)) && ($this->is_readable($ext)) ){
        $info['content'] = $this->fs->get_contents($path) ? $this->fs->get_contents($path) : 'Error in getting content';
        $info['is_image'] = false;
      } 
    }
  }
  
  return $info;
  }

  public function get_icon(string $filename)
  {
    $ext = $filename === 'dir' ? 'dir' : \bbn\str::file_ext($filename);
    if ( !empty($ext) ){
      switch ( $ext ){
        case 'dir':
          return 'fas fa-folder bbn-yellow';
        case 'xlsx':
        case 'csv':
        case 'ods':
        case 'xsl':
        case 'xlt':
        case 'xltm':
          return 'fas fa-file-excel';
        case 'doc':
        case 'dot':
        case 'wbk':
        case 'docx':
        case 'dotx':
        case 'docb':
          return 'fas fa-file-word';
        case 'html':
        case 'xml':
          return 'fas fa-file-code';
        case 'js':
          return 'fab fa-js';
        case 'php':
          return 'fab fa-php';
          break;
        case 'css':
        case 'json':
        case 'less':
          return 'icon-css';
        case 'zip':
          return 'fas fa-file-archive';
        case 'pdf':
          return 'far fa-file-pdf';
        case 'txt':
        case 'log':
          return 'zmdi zmdi-file-text';
        case 'cert':
        case 'cer':
          return 'fas fa-certificate';
        case 'gitignore':
          return 'zmdi zmdi-github-alt';
        case 'lock':
          return 'fas fa-lock';
        case 'gif':
        case 'svg':
        case 'png':
        case 'jpeg':
        case 'jpg':
          return 'fas fa-image';
        default:
          return 'fas fa-file';
      }
    }
  }
  public function dirsize($path){
    return \bbn\str::say_size($this->fs->dirsize($path));
    //return $this->fs->dirsize($path);
  }
  

  public function preview($filename)
  {

  }


}