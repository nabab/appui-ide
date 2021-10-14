<?php
/**
 * Created by PhpStorm.
 * User: BBN
 * Date: 08/02/2019
 * Time: 17:17
 */

namespace appui;

use bbn\X;

class finder
{

  protected $fs;

  public function __construct(\bbn\File\System $fs)
  {
    $this->fs = $fs;
  }
  
  public function explore($path = ''): ?array
  {
    if (!$path) {
      $path = '.';
    }
    $res = [
      'is_dir' => $this->fs->isDir($path),
      'path' => $path,
      'data' => [],
      'num_files' => 0,
      'num_dirs' => 0
    ];
    if ($tmp = $this->fs->getFiles(!empty($path) ? $path : '.', true, true, null, 't')) {
      $res['data'] = array_map(function($a){
        X::log(["LOOP", $a]);
        return [
          'text' => !empty($a['name']) ? X::basename($a['name']) : $path,
          'value' =>  !empty($a['name']) ? X::basename($a['name']) : $path,
          'dir' => $a['dir'],
          'file' => $a['file']
        ];
      }, $tmp);
      $res['num_files'] = count(array_filter($res['data'], function($a){
        return $a['file'] === true;
      }));
      $res['num_dirs'] = count(array_filter($res['data'], function($a){
        return $a['dir'] === true;
      }));
    }
    return $res;
    
  }
  
  public function get_info_dir($path = '')
  {
    $num_files = 0;
    $num_dirs = 0;
    $files = array_filter($this->getData($path), function($a){
      return $a['file'] === true;
    });
    if ( !empty($files) ){
      $num_files = count($files);
    };
   
    $dirs = array_filter($this->getData($path), function($a){
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
  public function get_data($path = '')
  {
    if ( $files = $this->fs->getFiles( !empty($path) ? $path : '.', true, true, null, 't') ){
      
      return array_map(function($a){
        return [
          'icon' => $this->get_icon($a['file'] ? $a['path'] : 'dir'),
          'text' => !empty($a['path']) ? basename($a['path']) : $path,
          'value' =>  !empty($a['path']) ? basename($a['path']) : $path,
          'dir' => $a['dir'],
          'file' => $a['file']
        ];
      }, $files);
    }
    return [];
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
    $i = new \bbn\File\Image($path, $this->fs);
    $info = [
      'height' => $i->getHeight(),
      'width' =>  $i->getWidth(),
    ];
    return $info;  
  }
  
  public function get_info($path, $ext)
  {
    if ( $this->fs->getMode() === 'nextcloud' ){
      $path = $this->fs->getRealPath($path);
    }
    $info = [];
    if ( $this->fs->exists($path) ){
      
      $size = $this->fs->filesize($path);
      $info['size'] = \bbn\Str::saySize($size);
      $info['mtime'] = \bbn\Date::format($this->fs->filemtime($path));
      //$info['creation'] = \bbn\Date::format(filectime($path));
      if ( !empty($ext) ){
        if ( $this->is_img($ext) ){
          $info['is_image'] = true;
          $info['image'] = $this->get_image_infos($path);
         
        }
        else if ( $this->is_readable($ext) ){
          $info['content'] = $this->fs->getContents($path) ? $this->fs->getContents($path) : 'Error in getting content';
          $info['is_image'] = false;
        }
      }
      else if ( $size < 5000 ){
        $info['content'] = $this->fs->getContents($path) ? $this->fs->getContents($path) : 'Error in getting content';
      }
    }
    return $info;
  }

  public function get_icon(string $filename)
  {
    $ext = $filename === 'dir' ? 'dir' : \bbn\Str::fileExt($filename);
    if ( !empty($ext) ){
      switch ( $ext ){
        case 'dir':
          return 'nf nf-fa-folder bbn-yellow';
        case 'xlsx':
        case 'csv':
        case 'ods':
        case 'xsl':
        case 'xlt':
        case 'xltm':
          return 'nf nf-fa-file_excel';
        case 'doc':
        case 'dot':
        case 'wbk':
        case 'docx':
        case 'dotx':
        case 'docb':
          return 'nf nf-fa-file_word';
        case 'html':
        case 'xml':
          return 'nf nf-fa-file_code';
        case 'js':
          return 'nf nf-fa-js';
        case 'php':
          return 'nf nf-fa-php';
          break;
        case 'css':
        case 'json':
        case 'less':
          return 'icon-css';
        case 'zip':
          return 'nf nf-fa-file_archive';
        case 'pdf':
          return 'nf nf-fa-file_pdf';
        case 'txt':
        case 'log':
          return 'zmdi zmdi-file-text';
        case 'cert':
        case 'cer':
          return 'nf nf-fa-certificate';
        case 'gitignore':
          return 'zmdi zmdi-github-alt';
        case 'lock':
          return 'nf nf-fa-lock';
        case 'gif':
        case 'svg':
        case 'png':
        case 'jpeg':
        case 'jpg':
          return 'nf nf-fa-image';
        default:
          return 'nf nf-fa-file';
      }
    }
  }
  public function dirsize($path){
    return \bbn\Str::saySize($this->fs->dirsize($path));
    //return $this->fs->dirsize($path);
  }
  

  public function preview($filename)
  {

  }


}



