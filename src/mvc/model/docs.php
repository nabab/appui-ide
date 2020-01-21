<?php
/*
 * Describe what it does!
 *
 **/

//case delete file  in folder
//if ( !empty($model->data['class']) ){
  $path = BBN_LIB_PATH.'bbn/bbn/build/phpdox/xml/classes/bbn_appui_options.xml';
//}

if ( is_file($path) ){
  $xml = file_get_contents($path, true);
  $obj = simplexml_load_string($xml);
  $res = [
    'members' => [],
    'methods' => []
  ];
  $info_class = (array)$obj;
  function parse_docblock($db){
    if ( $db->description ){
      $attr = $db->description->attributes();
      return [
        'compact' => $attr && $attr['compact'] ? (string)$attr['compact'] : '',
        'full' => isset($db->description[0]) ? (string)$db->description[0] : ''
      ];
    }
    return '';
  }
  foreach ( $obj->member as $i => $m ){
    $o = (array)$m;
    if ( $m->docblock ){
      $o['description'] = parse_docblock($m->docblock);
    }
    $res['members'][] = $o;
    //var_dump($m->docblock->description);
  }
  foreach ( $obj->method as $i => $m ){
    $o = (array)$m;
    $o['return'] =  (array_key_exists('return', $o) && !empty($o['return'])) ? (array)$o['return'] : '';
    if ( array_key_exists('parameter', $o) && !empty($o['parameter']) ){
      $o['parameter'] = (array)$o['parameter'];
      $o['parameter'] = array_map(function($a){return (array)$a;}, $o['parameter']);
    }
    else{
      $o['parameter'] = '';
    }
    if ( $m->docblock ){
      $o['description'] = parse_docblock($m->docblock);
    }
    $res['methods'][] = $o;
  }

  return [
    'success' => true,
    'parser' => $res,
    'class' => $info_class['@attributes']
  ];
}
return [
  'success' => false,
  'parser' => false,
  'class' => false
];