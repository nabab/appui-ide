<?php
if ( $ctrl->inc->ide && !empty($ctrl->arguments) ){
  $ctrl->data = [
    'repository' => '',
    'nameRepository' => '',
    'typeSearch' => '',
    'searchFolder' => '',
    'mvc' => false,
    'isProject' => $ctrl->arguments[1] === '_project_' || $ctrl->arguments[4] === '_project_' ,
  //  'search' => urldecode($ctrl->arguments[count($ctrl->arguments)-1]),
    'search' => base64_decode($ctrl->arguments[count($ctrl->arguments)-1]),
    'component' => false,
    'type' => '',
  ];
$ctrl->arguments[count($ctrl->arguments)-1] = $ctrl->data['search'];


  if ( $ctrl->data['isProject'] === true ){
    $ctrl->data['type'] = $ctrl->arguments[2];
  }

//case folder
  $folder = "";

  foreach ($ctrl->arguments as $i => $v){

    if( $v === "_folder_" ){
      for( $y = $i+1; $y < count($ctrl->arguments)-1; $y++ ){
        $folder .= "/".$ctrl->arguments[$y];
      }
    }
    if( $v === "_vue_" ){
      $ctrl->data['component'] = $ctrl->arguments[$i+1];
      $ctrl->data['searchFolder'] = $ctrl->arguments[$i+1];
    }
  }

  if ( !empty($folder) ){
    $ctrl->data['searchFolder'] = $folder;
  }





  foreach( $ctrl->arguments as $key => $val ){
    if ( $val !== "_end_" ){
      $ctrl->data['nameRepository'] .=  $val.'/';
    }
    else{
      $ctrl->data['typeSearch'] = $ctrl->arguments[$key+1];
      break;
    }
  }
  if ( $ctrl->data['isProject'] ){
    $ctrl->data['nameRepository'] = $ctrl->arguments[0].'/';
  }


  $ctrl->data['repository'] = $ctrl->inc->ide->repositories($ctrl->data['nameRepository']);
  //$ctrl->arguments[count($ctrl->arguments)-1] = urlencode($ctrl->arguments[count($ctrl->arguments)-1]);
  $ctrl->arguments[count($ctrl->arguments)-1] = base64_encode($ctrl->arguments[count($ctrl->arguments)-1]);
  $url = 'search/'.implode('/', $ctrl->arguments);

///  \bbn\x::log([$url],'searchIDe');

  if ( !empty($ctrl->data['repository']) &&
    !empty($ctrl->data['typeSearch']) &&
    !empty($ctrl->data['search'])
  ){
    if ( !empty($ctrl->data['repository']['tabs']) ){
      $ctrl->data['mvc'] = true;
    }
    $ctrl->obj->icon = 'nf nf-fa-search';
    $ctrl->obj->url = $url;
  
    $ctrl->combo(\bbn\str::cut($ctrl->data['search'], 12), true);
  }
}
