<?php
$res = [
  'success' => false,
  'tree' => [],
  'class' => false
];

$get_tree = ['properties', 'methods'];

if ( !empty($model->data['cls']) ){
  $parser = new \bbn\parsers\php();

  $file = basename($model->data['cls'],'.php');

  $path = dirname($model->data['cls']);

  // temporaney for classs bbn i lib
  if ( !empty($model->data['repository']) && $model->data['repository'] === 'bbn' ){
    $start = strlen('lib/bbn/src/');
    $class = 'bbn\\'.substr($path, $start).'\\'.$file;
  }
  else {
    $start = $model->data['project'] ? strpos($path,'lib/')+4 : strpos($path,'src/')+4;
    $class = substr($path, $start).'\\'.$file;
  }
  $class = str_replace('/', '\\',$class);


  $tree = $parser->analyze($class);

  if ( !empty($tree) ){
    foreach( $get_tree as $ele ){
      $cfg = [
        'text' => $ele,
        'name' => $ele,
        'numChildren' => count($tree[$ele]),
        'num' => count($tree[$ele]),
        'items' => [],
        'icon' => "nf nf-fa-folder"
      ];

      if ( $cfg['num'] > 0 ){
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
            $element =  [
              'text' => $ele === 'properties' ? $val : $name,
              'name' =>  $ele === 'properties' ? $val : $name,
              'numChildren' => 0,
              'num' => 0,
              'type' => $ele !== 'properties' ? $val['type'] : false,
              'line' => $ele === 'methods' ? $val['line'] : false,
              'icon' => $ele === 'properties' ? "nf nf-dev-code" : "nf nf-mdi-function",
              'items' =>[],
              'all' => $val
            ];
            if ( ($ele === 'methods') && ($val['type'] !== 'origin') ){
              $element['items'][] = [
                'text' => $val['file'],
                'name' => $val['file'],
                'file' => true,
                'numChildren' => 0,
                'num' => 0,
                'type' => $val['type'],
                'items' =>[]
              ];
            }
            $element['num'] = count($element['items']);
            $element['numChildren'] = count($element['items']);
            $value['items'][] = $element;
          }
        }
      }
      $res['tree'][] = $cfg;
    }
  }
  $res['success'] = true;
  $res['class'] =  $class;
}
return $res;