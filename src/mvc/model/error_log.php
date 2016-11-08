<?php
/** @var $model \bbn\mvc\model */
$file = ini_get('error_log');
if ( empty($file) && defined('BBN_LOG_PATH') ){
  $file = BBN_LOG_PATH.'error_log';
}
if ( is_file($file) ){
  // Cache name
  $ln = 'bbn-ide-error_log-';
  $res = [];
  $lines = file($file);
  foreach ( $lines as $o ){
    preg_match_all('/\[([^\]]+)\]/', $o, $r);
    if ( isset($r[1][0]) ){
      if ( $pos_mill = strpos($r[1][0], '.') ){
        $r[1][0] = substr($r[1][0], 0, $pos_mill).substr($r[1][0], strpos($r[1][0], ' ', $pos_mill));
      }
      if ( strpos($o, ' PHP ') && ($d = date_parse($r[1][0])) ){
        $php = strpos($o, ' PHP ') + 5;
        $coma = strrpos($o, ',');
        $reste = trim(substr($o, $php, $coma - $php));
        $time = mktime($d['hour'], $d['minute'], $d['second'], $d['month'], $d['day'], $d['year']);
        // Trace
        if ( \bbn\str::is_integer(substr($reste, 0, 1)) ){
          if ( isset($cur) ){
            $idx = intval(trim(substr($reste, 0, strpos($reste, '.'))));
            if ( $idx === 1 ){
              $res[$cur]['trace'] = [];
            }
            $res[$cur]['trace'][$idx - 1] = [
              'index' => $idx,
              'text' => trim(substr($reste, strpos($reste, '.') + 1))
            ];
          }
        }
        // Stack trace announced
        else{
          if ( strpos($reste, 'Stack trace:') === 0 ){
          }
          // Error exists
          else{
            if ( isset($res[$reste]) ){
              $res[$reste]['count']++;
              $res[$reste]['last_date'] = date('Y-m-d H:i:s', $time);
            }
            else{
              $cur = $reste;
              $column = strpos($cur, ':');
              $before_file = strrpos($cur, ' in ');
              $after_file = strrpos($cur, ' in ') + 4;
              if ( strrpos($cur, ' on line ') ){
                $before_line = strrpos($cur, ' on line ');
                $after_line = strrpos($cur, ' on line ') + 9;
              }
              else{
                $before_line = strrpos($cur, ':');
                $after_line = strrpos($cur, ':') + 1;
              }
              //\bbn\x::log($reste);
              $res[$cur] = [
                'count' => 1,
                'last_date' => date('Y-m-d H:i:s', $time),
                'first_date' => date('Y-m-d H:i:s', $time),
                'type' => substr($cur, 0, $column),
                'error' => trim(substr($cur, $column + 1, $before_file - ($column + 1))),
                'file' => trim(substr($cur, $after_file, $before_line - $after_file)),
                'line' => intval(trim(substr($cur, $after_line)))
              ];
            }
          }
        }
      }
    }
  }
  foreach ( $res as $k => $v ){
    if ( isset($res[$k]['trace']) && is_array($res[$k]['trace']) ){
      ksort($res[$k]['trace']);
    }
  }
  return [
    'total' => count($res),
    'data' => array_values($res)
  ];
}
return [
  'total' => 0,
  'data' => []
];