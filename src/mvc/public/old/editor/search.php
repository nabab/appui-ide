<?php
use bbn\Str;

if ( $ctrl->inc->ide && !empty($ctrl->arguments) ){
  $ctrl->addData([
    'typeSearch' => '',
    'searchFolder' => '',
    'search' => base64_decode($ctrl->arguments[count($ctrl->arguments)-1]),
    'all' => $ctrl->arguments[0] === '_all_'
  ]);
  if ( $ctrl->arguments[0] === '_all_' ){
    $ctrl->obj->icon = 'nf nf-fa-search_plus';
  }
  else {
    $ctrl->addData([
      'repository' => '',
      'nameRepository' => $ctrl->arguments[0].'/'.$ctrl->arguments[1],
      'mvc' => false,
      'isProject' => $ctrl->arguments[2] === '_project_' || $ctrl->arguments[4] === '_project_' ,
      'component' => false,
      'type' => '',
      'plugin' => false
    ]);

    $ctrl->arguments[count($ctrl->arguments)-1] = $ctrl->data['search'];

    // get type project
    if ( $ctrl->data['isProject'] === true ){
       $ctrl->data['type'] = $ctrl->arguments[3];
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
      if ( $val === "_end_" ){
        $ctrl->data['typeSearch'] = $ctrl->arguments[$key+1];
        break;
      }
    }

    $ctrl->data['repository'] = $ctrl->inc->ide->repository($ctrl->data['nameRepository']);
    $url = 'search/'.implode('/', $ctrl->arguments);

    if ( !empty($ctrl->data['repository']) &&
      !empty($ctrl->data['typeSearch']) &&
      !empty($ctrl->data['search'])
    ){
      if ( !empty($ctrl->data['repository']['tabs']) ){
        $ctrl->data['mvc'] = true;
      }
    }
    $ctrl->obj->url = $url;
    $ctrl->obj->icon = 'nf nf-fa-search';
  }

  $ctrl->combo(Str::cut($ctrl->data['search'], 12), true);
}
