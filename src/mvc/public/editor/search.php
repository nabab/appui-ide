<?php
if ( $ctrl->inc->ide ){
  $ctrl->data = [
    'repository' => '',
    'nameRepository' => '',
    'typeSearch' => '',
    'searchFolder' => '',
    'mvc'=> false,
    'search' => $ctrl->arguments[count($ctrl->arguments)-1]
  ];
//case folder
  $folder = "";
  foreach( $ctrl->arguments as $i=>$v ){
    if( $v === "folder" ){
      for( $y = $i+1; $y < count($ctrl->arguments)-1; $y++ ){
        $folder .= "/".$ctrl->arguments[$y];
      }
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
  $ctrl->data['repository'] = $ctrl->inc->ide->repositories($ctrl->data['nameRepository']);

  if ( !empty($ctrl->data['repository']) &&
    !empty($ctrl->data['typeSearch']) &&
    !empty($ctrl->data['search'])
  ){
    if ( !empty($ctrl->data['repository']['tabs']) ){
      $ctrl->data['mvc'] = true;
    }
    $ctrl->obj->url = $ctrl->get_url();
    $ctrl->obj->icon = 'fas fa-search';
    $ctrl->combo(\bbn\str::cut($ctrl->data['search'], 12), true);
  }
}