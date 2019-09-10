<?php

/**
 * Created by BBN Solutions.
 * User: Vito Fava
 * Date: 15/12/17
 * Time: 13.02
 */
$res['success'] = false;
if ( !empty($model->data['search']) &&
    !empty($model->data['nameRepository']) &&
    !empty($model->data['repository']) &&
    isset($model->data['typeSearch']) &&
    isset($model->inc->ide)
){
  $list = [];
  $fileData = [];
  $result = [];
  $totLines = 0;
  $tot_num_files = 0;
//function that defines whether the search is sensitive or non-sensitive
  $typeSearch= function($element, $code, $type){
    if ( $type === "sensitive"){
     return strpos($element, $code);
    }
    else{
     return stripos($element, $code);
    }
  };


  if ( !empty($model->data['isProject']) ){
    $part = $model->data['type'];
  }
  else{
    $part = $model->data['repository']['path'];
  }

  $path = $model->inc->ide->decipher_path($model->data['repository']['bbn_path'].'/'.$model->data['repository']['code'].$part);
  $all = \bbn\file\dir::get_files($path, true);


  if ( is_array($all) ){

    if ( !empty($all) ){
      foreach($all as $i => $v){
        if ( basename($v) !== "cli"  ){
          //if folder

          if ( is_dir($v) ){
            //case tree
            if ( !empty($model->data['searchFolder']) ){
              if ( !empty($model->data['mvc']) || $model->data['type'] === 'mvc'){
                $content = $v;
              }
              else{
                $content = $path;
              }
              $content .= $model->data['searchFolder'];
            }
            else{
              $content = $v;
            }

            $content = \bbn\file\dir::scan($content);
            if ( is_array($content) ){
              foreach($content as $j => $val){
                $list= [];
                if ( is_file($val) ){
                  $tot_num_files++;

                  if ( $typeSearch(file_get_contents($val), $model->data['search'], $model->data['typeSearch']) !== false ){

                    //for plugin in vendor
                    if ( explode("/",$model->data['repository']['path'])[0] === 'bbn'){
                      $pathFile = substr($val, strpos($val, 'mvc'));                      
                    }
                    else{
                      $pathFile = substr($val, strpos($val, $model->data['repository']['path']));
                    }

                    $base = $model->data['repository']['bbn_path'];
                    if ( strpos($pathFile, $base) === 0 ){
                       $link = substr($pathFile, strlen($base));
                       $link = explode('/', $link);
                       array_shift($link);
                    }
                    else{
                      $link = explode('/', $pathFile);
                      array_shift($link);
                    }

                    if ( (!empty($model->data['isProject']) && $model->data['type'] === 'mvc') ||
                     !empty($model->data['mvc'])
                    ){
                      $tab = array_shift($link);
                      $link = implode('/', $link);
                      $link = explode('.', $link);
                      $link = array_shift($link);                     
                    }
                    else if ( (!empty($model->data['isProject']) && $model->data['type'] === 'components') ||
                     !empty($model->data['components'])
                    ){
                      $link = implode('/', $link);
                      $link = explode('.', $link);
                      $tab = array_pop($link);
                      $link = $link[0];
                    }
                    else if( empty($model->data['isProject']) && empty($model->data['type']) ) {

                      $file = $link[count($link)-1];
                      $file = explode('.', $file);
                      $tab = array_pop($file);
                      $link[count($link)-1] = array_shift($file);
                      $link = implode('/', $link);
                    }

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
                        if ( !empty($model->data['mvc']) ||
                          (!empty($model->data['isProject']) && $model->data['type'] === 'mvc')
                        ){
                          if ( $tab === "public" ){
                            $tab = 'php';
                          }
                          else{
                            if ( explode("/",$pathFile)[1] === "html" ){
                              $lineCurrent = htmlentities($lineCurrent);
                            }
                          }
                        }
                        $text .= str_replace($model->data['search'], "<strong><span class='underlineSeach'>".$model->data['search']."</span></strong>", $lineCurrent);
                        $path = explode('/', $pathFile);
                        $file_name = array_pop($path);
                        $path= implode('/', $path);

                        $path = str_replace($base, (strpos($pathFile, $model->app_path()) === 0 ? 'BBN_APP_PATH/' : 'BBN_LIB_PATH/'), $path);

                        $list[] = [
                          'text' => strlen($text) > 1000 ? $line."<strong><i>"._('content too long to be shown')."</i></strong>" : $text,
                          'line' =>  $lineNumber-1,
                          'position' => $position,
                          'linkPosition' => $link,
                          'tab' =>  !empty($tab) ? $tab : false,
                          'code' => true,
                          'path' => $path.'/'.$file_name,
                          'icon' => 'zmdi zmdi-code'
                        ];
                      }
                      //next line
                      $file->next();
                    }
                  }
                }
                //if we find rows then we will create the tree structure with all the information
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

                  $path = str_replace($base, (strpos($pathFile, $model->app_path()) === 0 ? 'BBN_APP_PATH/' : 'BBN_LIB_PATH/'), $path);

                  $fileData = [
                    'text' => basename($pathFile)."&nbsp;<span class='bbn-badge bbn-s bbn-bg-lightgrey'>".count($list)."</span>",
                    'icon' => 'nf nf-fa-file_code',
                    'num' => count($list),
                    'numChildren' => count($list),
                    'repository' => $model->data['repository']['bbn_path'].'/',
                    'path' => $path.$file_name, ///$pathFile,
                    'file' => basename($pathFile),
                    'forLink' => !empty($link) ? $link : false,
                    'tab' =>  !empty($tab) ? $tab : false,
                    'items' => $list
                  ];



                  if( !isset($result[$namePath]) ){
                    $result[$namePath]= [
                      'text' => $path,
                      'num' => 1,
                      'numChildren' => 1,
                      'items' => [],
                      'icon' => !empty($model->data['component']) ? 'nf nf-fa-vuejs' : 'zmdi zmdi-folder-outline'
                    ];
                    $result[$namePath]['items'][] = $fileData;
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
                      $result[$namePath]['items'][] = $fileData;
                      $result[$namePath]['num']++;
                      $result[$namePath]['numChildren']++;
                    }
                  }
                }
              }
            }
       
          }
          else{
            $tot_num_files++;
            $list= [];
            if ( $typeSearch(file_get_contents($v), $model->data['search'], $model->data['typeSearch']) !== false ){
              $pathFile = substr($v, strpos($v, $model->data['repository']['path']));
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

                  $path = str_replace($base, (strpos($pathFile, $model->app_path()) === 0 ? 'BBN_APP_PATH/' : 'BBN_LIB_PATH/'), $path);

                  if ( !empty($model->data['mvc']) ){
                    if ( explode("/",$pathFile)[1] === "public" ){
                      $tab = 'php';
                    }
                    else{
                      $tab = explode("/",$pathFile)[1];
                    }
                    $link =  explode(".",substr($pathFile, strlen(explode("/",$pathFile)[0].'/'.explode("/",$pathFile)[1])+1))[0];
                  }
                  $list[] = [
                    'text' => strlen($text) > 1000 ?  $line."<strong><i>"._('content too long to be shown')."</i></strong>" : $text,
                    'line' =>  $lineNumber-1,
                    'position' => $position,
                    'code' => true,
                    'path' =>  $path.'/'.$file_name,
                    'icon' => 'zmdi zmdi-code',
                    'linkPosition' => explode(".",substr($pathFile, strlen(explode("/",$pathFile)[0].'/'.explode("/",$pathFile)[1])+1))[0],
                    'tab' =>  !empty($tab) ? $tab : false
                  ];
                }
                $file->next();
              }

              if ( count($list) > 0 ){
                $totLines .= count($list);
                $fileData = [
                  'text' => basename($pathFile)."&nbsp;<span class='bbn-badge bbn-s bbn-bg-lightgrey'>".count($list)."</span>",
                  'icon' => 'nf nf-fa-file_code',
                  'num' => count($list),
                  'numChildren' => count($list),
                  'repository' => $model->data['repository']['bbn_path'].'/',
                  'path' => $path.'/'.$file_name,
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
                    'icon' => !empty($model->data['component']) ? 'nf nf-fa-vuejs' : 'zmdi zmdi-folder-outline'
                  ];
                  $result[$namePath]['items'][] = $fileData;
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
                    $result[$namePath]['items'][] = $fileData;
                    $result[$namePath]['num']++;
                    $result[$namePath]['numChildren']++;
                  }
                }
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
      $result[$key]['text'] = str_replace($result[$key]['text'], $result[$key]['text']."&nbsp;<span class='bbn-badge bbn-s bbn-bg-lightgrey'>".$result[$key]['numChildren']."</span>",$result[$key]['text']);
    }
    return [
      'list' => array_values($result),
      'totFiles' => $totFiles,
      'allFiles' => $tot_num_files++,
      'totLines' => $totLines
    ];
  }
}
return $res;
