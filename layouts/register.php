<?php

include 'connect.php';

if (isset($_POST['signUp'])) {
    $firstName = $_POST['firstName'];
    $lastName = $_POST['lastName'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $password=md5($password);

    $checkEmail = "SELECT * FROM users WHERE email='$email'";
    $result=$conn->query($checkEmail);
    if ($result->num_rows > 0) {
        echo "Email already exists.";
    } else {
        $insertQuery = "INSERT INTO users (firstName, lastName, email, password)
                VALUES ('$firstName', '$lastName', '$email', '$password')";
        if ($conn->query($insertQuery) === TRUE) {
            header("location: login.html");
        } else {
            echo "Error: "  . $conn->error;
        }
    }
}

if (isset($_POST['signIn'])) {
    $email = $_POST['email'];
    $password = $_POST['password'];
    $password=md5($password);
    $sql = "SELECT * FROM users WHERE email='$email' AND password='$password'";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        session_start();
        $row = $result->fetch_assoc();
        $_SESSION['email'] = $row['email'];
        header("location: index.php");
        exit();
    } else {
        echo "Wrong Email or Password.";
    }
}
?>
