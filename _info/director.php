<?php
#  ini_set('error_reporting', E_ALL);
#  ini_set('display_errors', 1);
#  ini_set('display_startup_errors', 1);

  $text = test_input($_GET['text']);
  $blue_text = explode('-', $text);
  
  $blue_book = $blue_text[0];
  $blue_chap = $blue_text[1];
  $blue_part = $blue_text[2];

  $script = '<script>';
  $script .= 'localStorage.setItem("bluebook", "' . $blue_book . '");';
  $script .= 'localStorage.setItem("bluechap", "' . $blue_chap . '");';
  $script .= 'localStorage.setItem("bluepart", "' . $blue_part . '");';
  $script .= 'localStorage.setItem("blueicon", 2);';
  $script .= '</script>';
  
  echo $script;
  
  function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
  }
?>