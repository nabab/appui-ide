<?php
$res = [
  'success' => false,
  'tree' => []  
];

$get_tree = ['properties', 'methods'];

if ( !empty($model->data['cls']) ){
  $parser = new \bbn\parsers\php();

  $file = basename($model->data['cls'],'.php');
  $class = array_pop(explode("/",dirname($model->data['cls']))).'\\'.$file ;    
  //$cfg = [];  
  $tree = $parser->analyze($class);
  
  if ( !empty($tree) ){
    foreach( $get_tree as $ele ){
      if ( !empty($tree[$ele]) ){    
        $cfg = [
            'text' => $ele,
            'name' => $ele,    
            'numChildren' => count($tree[$ele]),    
            'num' => count($tree[$ele]),    
            'items' => [],
            'icon' => "nf nf-fa-folder"
        ];

        foreach( $tree[$ele] as $i => $type ){
          $cfg['items'][] = [
            'text' => $i,
            'name' => $i,    
            'numChildren' => count($type),    
            'num' => count($type),    
            'items' => [],     
            'icon' => "nf nf-fa-folder"          
          ];
        }

        foreach( $cfg['items'] as &$value ){
          foreach( $tree[$ele][$value['name']] as $name => $val ){ 
            $value['items'][] = [
                'text' => $ele === 'properties' ? $val : $name,
                'name' =>  $ele === 'properties' ? $val : $name,    
                'numChildren' => 0,    
                'num' => 0,
                'type' => $ele !== 'properties' ? $val['type'] : false,
                'line' => $ele === 'methods'  ? $val['line'] : false,
                'icon' => $ele === 'properties' ? "nf nf-dev-code" : "nf nf-mdi-function", 
                'items' =>[],
                'all' => $val             
            ];
          }
        }
      }
      $res['tree'][] = $cfg;        
    }
  } 
  $res['success'] = 'true';
}    
return $res;