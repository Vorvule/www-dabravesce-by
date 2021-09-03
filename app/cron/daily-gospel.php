<?php

    # DELETE dev/ AND REMARKS ON RELEASE

    # ini_set('error_reporting', E_ALL);
    # ini_set('display_errors', 1);
    # ini_set('display_startup_errors', 1);
    date_default_timezone_set('Europe/Minsk');


    if (date('z') > 357) { # Christmas Eve 358/359-th day/s; Christmas is 359/360-th day; And until New Year
        
        $chap = 2; # Gospel of Luke
        $part = 0; # First chapter
        
    } else { # 89 Gospel chapters x 4 Times = 356 Days = indexes 0...355; indexes 356 and 357 are for Mathew 1, 2 = fit for Christmas reading

        $modulus = date('z') % 89; # date('z') = day of the year, zero based
        
        switch(true) {
            
            case $modulus < 28:
                $chap = 0;
                $part = $modulus;
                break;
                
            case $modulus > 27 and $modulus < 44:
                $chap = 1;
                $part = $modulus - 28;
                break;
                
            case $modulus > 43 and $modulus < 68:
                $chap = 2;
                $part = $modulus - 44;
                break;
                
            case $modulus > 67:
                $chap = 3;
                $part = $modulus - 68;
                
        }
        
    }
    
    file_put_contents('/var/www/a1056901/data/www/dabravesce.by/dev/app/cron/daily-gospel.txt', $chap . ' | ' . $part);
    # echo $chap . ' | ' . $part;
    
?>