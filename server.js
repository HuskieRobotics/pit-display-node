<!DOCTYPE html>
<html>
<head>
  <title>Page 1</title>
  <style>
    .page {
      display: none;
    }
  </style>
</head>
<body>
  <div id="page1" class="page">
    <h1>Page 1</h1>
    <button onclick="navigateToPage2()">Go to Page 2</button>
  </div>

  <div id="page2" class="page">
    <h1>Page 2</h1>
    <button onclick="navigateToPage1()">Go to Page 1</button>
  </div>

  <script>
    function navigateToPage2() {
      document.getElementById("page1").style.display = "none";
      document.getElementById("page2").style.display = "block";
    }

    function navigateToPage1() {
      document.getElementById("page2").style.display = "none";
      document.getElementById("page1").style.display = "block";
    }
  </script>
</body>
</html>