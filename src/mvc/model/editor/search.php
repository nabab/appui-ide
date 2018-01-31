<?php

/**
 * Created by BBN Solutions.
 * User: Vito Fava
 * Date: 15/12/17
 * Time: 13.02
 */

$res['success'] = false;
if ( !empty($model->data) &&
    !empty($model->data['search']) &&
    !empty($model->data['nameRepository']) &&
    !empty($model->data['repository']) &&
    isset($model->data['typeSearch']) &&
    isset($model->inc->ide)
){
  $list = [];
  $fileData = [];
  $result = [];
  $totLines = 0;
//function that defines whether the search is sensitive or non-sensitive
  $typeSearch= function($element, $code, $type){
    if ( $type === "sensitive"){
     return strpos($element, $code);
    }
    else{
     return stripos($element, $code);
    }
  };


  $path = $model->inc->ide->decipher_path($model->data['repository']['bbn_path'].'/'.$model->data['repository']['path']);
  //case mvc
  if ( !empty($model->data['mvc']) ){
    $all = \bbn\file\dir::get_files($path, true);
  }
  //case no mvc
  else{
    //if case search folder in a repository no mvc
    if ( isset($model->data['searchFolder']) && !empty($model->data['searchFolder']) ){
      $path .= $model->data['searchFolder'];
      $path = str_replace("//","/",$path);
    }
    $all = \bbn\file\dir::scan($path);
  }

  foreach($all as $i => $v){
    if ( basename($v) !== "cli" ){
      if ( is_dir($v) ){
        if ( isset($model->data['searchFolder']) && !empty($model->data['searchFolder']) ){
          $comp = $v.$model->data['searchFolder'];
        }
        else{
          $comp = $v;
        }
        $content = \bbn\file\dir::scan($comp);
        foreach($content as $j => $val){
          $list= [];
          if ( (is_file($val)) && ($typeSearch(file_get_contents($val), $model->data['search'], $model->data['typeSearch']) !== false) ){
            //for plugin in vendor
            if ( explode("/",$model->data['repository']['path'])[0] === 'bbn'){
              $pathFile = substr($val, strpos($val, 'mvc'));
            }
            else{
              $pathFile = substr($val, strpos($val, $model->data['repository']['path']));
            }
           $fileName = basename($pathFile);
            //object initialization with every single file to check the lines that contain it
            $file = new \SplFileObject($val);
            //cycle that reads all the lines of the file, it means until it has finished reading a file
            while( !$file->eof() ){
              //current line reading
              $lineCurrent = $file->current();
              //if we find what we are looking for in this line and that this is not '\ n' then we will take the coirispjective line number with the key function, insert it into the array and the line number
              if ( ($typeSearch($lineCurrent, $model->data['search'], $model->data['typeSearch']) !== false) && (strpos($lineCurrent, '\n') === false) ){
                $lineNumber = $file->key()+1;
                $namePath = substr(dirname($val), strpos($val, $model->data['repository']['path']));
                $position = $typeSearch($lineCurrent, $model->data['search'], $model->data['typeSearch']);
                $line = "<strong>".'line ' . $lineNumber . ' : '."</strong>";
                $text = $line;
                if ( !empty($model->data['mvc']) ){
                  if ( explode("/",$pathFile)[1] === "public" ){
                    $tab = 'php';
                  }
                  else{
                    if ( explode("/",$pathFile)[1] === "html" ){
                      $lineCurrent = htmlentities($lineCurrent);
                    }
                    $tab = explode("/",$pathFile)[1];
                  }
                  $link =  explode(".",substr($pathFile, strlen(explode("/",$pathFile)[0].'/'.explode("/",$pathFile)[1])+1))[0];
                }
                $text .= str_replace($model->data['search'], "<strong><span class='underlineSeach'>".$model->data['search']."</span></strong>", $lineCurrent);
                array_push($list, [
                  //'text' => !empty($tab) && ($tab==='html') ? htmlspecialchars($text) : $text,
                  'text' => strlen($text) > 1000 ? $line."<strong><i>"._('content too long to be shown')."</i></strong>" : $text,
                  'line' =>  $lineNumber-1,
                  'position' => $position,
                  'linkPosition' => explode(".",substr($pathFile, strlen(explode("/",$pathFile)[0].'/'.explode("/",$pathFile)[1])+1))[0],
                  'tab' =>  !empty($tab) ? $tab : false,
                  'code' => true,
                  'path' =>  $model->data['repository']['bbn_path'].'/'.$pathFile,
                  'icon' => 'zmdi zmdi-code'
                ]);
              }
              //next line
              $file->next();
            }
          }//if we find rows then we will create the tree structure with all the information
          if ( count($list) > 0 ){
            $totLines = $totLines + count($list);
            if ( !empty($model->data['mvc']) ){
              if ( explode("/",$pathFile)[1] === "public" ){
                $tab = 'php';
              }
              else{
                $tab = explode("/",$pathFile)[1];
              }
              $link =  explode(".",substr($pathFile, strlen(explode("/",$pathFile)[0].'/'.explode("/",$pathFile)[1])+1))[0];
            }

            $fileData = [
              'text' => basename($pathFile)."&nbsp;<span class='w3-badge w3-small w3-light-grey'>".count($list)." occurences</span>",
              'icon' => 'fa fa-file-code-o',
              'num' => count($list),
              'numChildren' => count($list),
              'repository' => $model->data['repository']['bbn_path'].'/',
              'path' => $pathFile,
              'file' => basename($pathFile),
              'forLink' => !empty($link) ? $link : false,
              'tab' =>  !empty($tab) ? $tab : false,
              'items' => $list
            ];
            if( !isset($result[$namePath]) ){
              $result[$namePath]= [
                'text' => $namePath,
                'num' => 1,
                'numChildren' => 1,
                'items' => [],
                'icon' => 'fa fa-folder'
                ];
              array_push($result[$namePath]['items'], $fileData);
            }
            else{
              $ctrlFile = false;
              //  check if the file where we found one or more search results is not reinserted
              foreach( $result[$namePath]['items'] as $key => $item ){
                if ( $item['file'] === basename($pathFile) ){
                  $ctrlFile = true;
                }
              }
              //if we do not have the file, we will insert it
              if ( empty($ctrlFile) ){
                array_push($result[$namePath]['items'], $fileData);
                $result[$namePath]['num']++;
                $result[$namePath]['numChildren']++;
              }
            }
          }
        }
      }
      else{
        $list= [];
        if ( $typeSearch(file_get_contents($v), $model->data['search'], $model->data['typeSearch']) !== false ){
          $pathFile = substr($v, strpos($v, $model->data['repository']['path']));
          $fileName = basename($pathFile);
          $file = new \SplFileObject($v);
          while( !$file->eof() ){
            $lineCurrent = $file->current();
            if ( ($typeSearch($lineCurrent, $model->data['search'], $model->data['typeSearch']) !== false) && (strpos($lineCurrent, '\n') === false) ){
              $lineNumber = $file->key()+1;
              $link =  explode(".",substr($pathFile, strlen(explode("/",$pathFile)[0].'/'.explode("/",$pathFile)[1])+1))[0];
              $namePath = substr(dirname($v), strpos($v, $model->data['repository']['path']));
              $position = $typeSearch($lineCurrent, $model->data['search'], $model->data['typeSearch']);
              $text = "<strong>".'line ' . $lineNumber . ' : '."</strong>";
              $text .= str_replace($model->data['search'], "<strong><span class='underlineSeach'>".$model->data['search']."</span></strong>", $lineCurrent);
              if ( !empty($model->data['mvc']) ){
                if ( explode("/",$pathFile)[1] === "public" ){
                  $tab = 'php';
                }
                else{
                  $tab = explode("/",$pathFile)[1];
                }
                $link =  explode(".",substr($pathFile, strlen(explode("/",$pathFile)[0].'/'.explode("/",$pathFile)[1])+1))[0];
              }
              array_push($list, [
                'text' => strlen($text) > 1000 ?  $line."<strong><i>"._('content too long to be shown')."</i></strong>" : $text,
                'line' =>  $lineNumber-1,
                'position' => $position,
                'code' => true,
                'path' =>  $model->data['repository']['bbn_path'].'/'.$pathFile,
                'icon' => 'zmdi zmdi-code',
                'linkPosition' => explode(".",substr($pathFile, strlen(explode("/",$pathFile)[0].'/'.explode("/",$pathFile)[1])+1))[0],
                'tab' =>  !empty($tab) ? $tab : false,
                'code' => true,
              ]);
            }
            $file->next();
          }
          if ( count($list) > 0 ){
            $totLines = $totLines + count($list);
            $fileData = [
              'text' => basename($pathFile)."&nbsp;<span class='w3-badge w3-small w3-light-grey'>".count($list)." occurences</span>",
              'icon' => 'fa fa-file-code-o',
              'num' => count($list),
              'numChildren' => count($list),
              'repository' => $model->data['repository']['bbn_path'].'/',
              'path' => $model->data['repository']['bbn_path'].'/'.$pathFile,
              'file' => basename($pathFile),
              'forLink' => !empty($link) ? $link : false,
              'tab' => !empty($tab) ? $tab : false,
              'items' => $list
            ];
            if( !isset($result[$namePath]) ){
              $result[$namePath]= [
                'text' => $namePath,
                'num' => 1,
                'numChildren' => 1,
                'items' => [],
                'icon' => 'fa fa-folder'
                ];
              array_push($result[$namePath]['items'], $fileData);
            }
            else{
              $ctrlFile = false;
              //  check if the file where we found one or more search results is not reinserted
              foreach( $result[$namePath]['items'] as $key => $item ){
                if ( $item['file'] === basename($pathFile) ){
                  $ctrlFile = true;
                }
              }
              //if we do not have the file, we will insert it
              if ( empty($ctrlFile) ){
                array_push($result[$namePath]['items'], $fileData);
                $result[$namePath]['num']++;
                $result[$namePath]['numChildren']++;
              }
            }
          }
        }
      }
    }
  }
  if( !empty($result) ){
    $totFiles = 0;
    foreach ($result as $key => $value) {
      $totFiles = $totFiles + $result[$key]['numChildren'];
      $result[$key]['text'] = str_replace($result[$key]['text'], $result[$key]['text']."&nbsp;<span class='w3-badge w3-small w3-light-grey'>".$result[$key]['numChildren']." files</span>",$result[$key]['text']);
    }
    return [
      'list' => array_values($result),
      'totFiles' => $totFiles,
      'totLines' => $totLines
    ];
  }

}
return $res;
