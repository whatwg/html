<html>

<head>
    <style>
        div {
            border: 1px solid black;
            width: 30%;
            margin-left: 300px;
            margin-top: 60px;
            padding: 10px;
        }

        h1 {
            text-align: center;
        }
    </style>
</head>

<body>
    <div>
        <h1><span style="color:red"></span><span style="color:green">student Registration Form</span></h1>
        <br>
        <br>
        your name:<input type="text">
        <br>
        <br>
        your password:<input type="password">
        <br>
        <br>
        Gender:
        <input type="radio" name="gender" value="male">male
        <input type="radio" name="gender" value="female">female
        <input type="radio" name="gender" value="other">other
        <br>
        <br>
        food preference:
        <input type="radio" name="food" value="veg">veg
        <input type="radio" name="food" value="nonveg">nonveg
        <input type="radio" name="food" value="both">both

        <br>
        <br>

        interested of course
        <select name="course">
            <option>select</option>
            <option>webdesigning</option>
            <option>web devlopement</option>
        </select>
        <br>
        <br>
        course stack:
        <input type="checkbox" name="html">html
        <input type="checkbox" name="css">css
        <input type="checkbox" name="js">js
        <input type="checkbox" name="jquery">jquery
        <br>
        <br>

        <br>
        Adress:
        <textarea rows="5" cols="50"></textarea>
        <input type="button" value="Registration">
    </div>
</body>

</html>
