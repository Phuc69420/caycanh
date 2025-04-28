<?php
// Thông tin database PlanetScale
$host = "aws.connect.psdb.cloud";
$dbname = "database_caycanh";
$username = "xfnciv27cppzx1e25syh";
$password = "pscale_pw_JKVbnJWfPNdKw2u9uLDuI9xyUk4Zb61jQCBpClVlV77";

// Kết nối database với SSL
$mysqli = new mysqli($host, $username, $password, $dbname, 3306, "/etc/ssl/certs/ca-certificates.crt");

// Kiểm tra kết nối
if ($mysqli->connect_error) {
    die("Kết nối thất bại: " . $mysqli->connect_error);
}

// Nếu không lỗi, hiện thông báo thành công
echo "Kết nối database thành công!";
?>
