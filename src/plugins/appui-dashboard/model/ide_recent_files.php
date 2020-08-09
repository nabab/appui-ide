<?php
/** @var \bbn\mvc\model $model */

$model->data['limit'] = isset($model->data['limit']) && is_int($model->data['limit']) ? $model->data['limit'] : 5;
$model->data['start'] = isset($model->data['start']) && is_int($model->data['start']) ? $model->data['start'] : 0;
$pref_cfg = $model->inc->pref->get_class_cfg();
$grid = new \bbn\appui\grid($model->db, $model->data, [
  'table' => $pref_cfg['tables']['user_options_bits'],
  'fields' => [
    'file' => $model->db->col_full_name($pref_cfg['arch']['user_options_bits']['text'], $pref_cfg['tables']['user_options_bits']),
    'moment' => $model->db->col_full_name($pref_cfg['arch']['user_options_bits']['cfg'], $pref_cfg['tables']['user_options_bits']) . '->>"$.last_date"'
  ],
  'join' => [[
    'table' => $pref_cfg['table'],
    'on' => [
      'conditions' => [[
        'field' => $model->db->col_full_name($pref_cfg['arch']['user_options']['id'], $pref_cfg['table']),
        'exp' => $model->db->col_full_name($pref_cfg['arch']['user_options_bits']['id_user_option'], $pref_cfg['tables']['user_options_bits'])
      ]]
    ]
  ]],
  'filters' => [
    'conditions' => [[
      'field' => $model->db->col_full_name($pref_cfg['arch']['user_options']['id_user'], $pref_cfg['table']),
      'value' => $model->inc->user->get_id()
    ], [
      'field' => $model->db->col_full_name($pref_cfg['arch']['user_options']['id_option'], $pref_cfg['table']),
      'value' => $model->inc->options->from_code('recent', 'ide', 'appui')
    ]]
  ],
  'order' => [[
    'field' => 'moment',
    'dir' => 'DESC'
  ]]
]);
if ( $grid->check() && defined('BBN_APP_NAME') ){
  $res = $grid->get_datatable();
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
    $res['data'][$i]['url'] = \bbn\str::parse_path('file/'.$root.'/'.$type.'/'.$file.'/_end_/'.$tab);
    $res['data'][$i]['filename'] = basename($d['file']);
  }
  return $res;
}