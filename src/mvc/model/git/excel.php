<?php
/* @var \bbn\mvc\model $model */
if ( !empty($model->data['excel']) && !empty($model->data['data']) ){
  $cfg = $model->data['excel'];
  $data = array_map(function($row) use($cfg){
    $row = $row['data'];
    if ( isset($row['user']) ){
      $row['user.username'] = $row['user']['username'];
      unset($row['user']);
    }
    foreach ( $row as $i => $r ){
      if ( 
        (($idx = \bbn\x::find($cfg, ['field' => $i])) === false ) ||
        !!$cfg[$idx]['hidden']
      ){
        unset($row[$i]);
      }
      if ( ($i === 'created_at') && !empty($r) ){
        $row[$i] = \PhpOffice\PhpSpreadsheet\Shared\Date::PHPToExcel($row[$i]);
      }
      if ( ($i === 'closed_at') && !empty($r) ){
        $row[$i] = \PhpOffice\PhpSpreadsheet\Shared\Date::PHPToExcel($row[$i]);
      }
    }
    $ret = [];
    foreach ( $cfg as $field ){
      $ret[$field['field']] = $row[$field['field']];
    }
    return $ret;
  }, $model->data['data']);
  $path = \bbn\x::make_storage_path(\bbn\mvc::get_user_tmp_path()) . 'export_' . date('d-m-Y_H-i-s') . '.xlsx';
  if ( \bbn\x::to_excel($data, $path, true, $cfg) ){
    return ['excel_file' => $path];
  }
}