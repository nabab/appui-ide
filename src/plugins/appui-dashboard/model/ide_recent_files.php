<?php
/** @var \bbn\Mvc\Model $model */

$model->data['limit'] = isset($model->data['limit']) && is_int($model->data['limit']) ? $model->data['limit'] : 5;
$model->data['start'] = isset($model->data['start']) && is_int($model->data['start']) ? $model->data['start'] : 0;
$pref_cfg = $model->inc->pref->getClassCfg();
$grid = new \bbn\Appui\Grid($model->db, $model->data, [
  'table' => $pref_cfg['tables']['user_options_bits'],
  'fields' => [
    'file' => $model->db->colFullName($pref_cfg['arch']['user_options_bits']['text'], $pref_cfg['tables']['user_options_bits']),
    'moment' => 'JSON_UNQUOTE(JSON_EXTRACT('.$model->db->colFullName($pref_cfg['arch']['user_options_bits']['cfg'], $pref_cfg['tables']['user_options_bits']).', "$.last_date"))'
  ],
  'join' => [[
    'table' => $pref_cfg['table'],
    'on' => [
      'conditions' => [[
        'field' => $model->db->colFullName($pref_cfg['arch']['user_options']['id'], $pref_cfg['table']),
        'exp' => $model->db->colFullName($pref_cfg['arch']['user_options_bits']['id_user_option'], $pref_cfg['tables']['user_options_bits'])
      ]]
    ]
  ]],
  'filters' => [
    'conditions' => [[
      'field' => $model->db->colFullName($pref_cfg['arch']['user_options']['id_user'], $pref_cfg['table']),
      'value' => $model->inc->user->getId()
    ], [
      'field' => $model->db->colFullName($pref_cfg['arch']['user_options']['id_option'], $pref_cfg['table']),
      'value' => $model->inc->options->fromCode('recent', 'ide', 'appui')
    ]]
  ],
  'order' => [[
    'field' => 'moment',
    'dir' => 'DESC'
  ]]
]);
if ( $grid->check() && defined('BBN_APP_NAME') ){
  $res = $grid->getDatatable();
  foreach ( $res['data'] as $i => $d ){
    $arr = explode("/", $d['file']);
    $type = '';
    $root = $arr[0].'/'.$arr[1];
    if ( !empty($arr[2]) ){
      $type = $arr[2];
      unset($arr[2]);
    }
    unset($arr[0]);
    unset($arr[1]);
    if ( ($type !== 'mvc') && ($type !== 'components') ){
      $tab = 'code';
    }
    else {
      $tab = array_shift($arr);
      $tab = $tab === 'public' ? 'php' : $tab;
    }
    $arr = implode('/', $arr);
    $file = explode('.', $arr)[0];
    $res['data'][$i]['url'] = \bbn\Str::parsePath('file/'.$root.'/'.$type.'/'.$file.'/_end_/'.$tab);
    $res['data'][$i]['filename'] = basename($d['file']);
  }
  return $res;
}