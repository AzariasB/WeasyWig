<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
Google maps API key : AIzaSyB4wcYndpXCDGPxRRm5r5yhIJOfoyE8Fi8
-->
<?php
//Need to read all existing project to display them
$projects = array();

foreach (new DirectoryIterator('assets/saves') as $fileInfo) {
    if ($fileInfo->isDot())
        continue;
    $projects[] = str_replace('.html', '', $fileInfo->getFilename());
}
?>

<html>
    <head>
        <meta charset="UTF-8">
        <title>Main menu</title>

        <!--  Css dependencies -->
        <link type="text/css" rel="stylesheet" href="assets/css/bootstrap.min.css" />
        <link type="text/css" rel="stylesheet" href="assets/css/home.css" />
        <link rel="icon" type="image/png" href="assets/images/favicon.ico" />

        <script src="assets/js/lib/jquery.js"></script>
        <script src="assets/js/lib/lightbox.js"></script>
    </head>
    <body>
        <div id="parallax" ></div>
        <canvas id="smooth_animation"></canvas>
        <div class="container-fluid fill">
            <div class="row" id="main_title">
                <div class="col-xs-12 col-sm-6">
                    <!--SVG Madness in there-->
                    <object hidden="" type="image/svg+xml" data="assets/svg/title.svg" class="logo"></object>
                </div>
            </div>
            <div id="heading_buttons" class="col-xs-12 text-center" >
                <ul class="list-inline" >
                    <li><a href="#Projects"><h4>Projects</h4></a></li>
                    <li><a href="#Localisation"><h4>Localisation</h4></a></li>
                    <li><a href="#API"><h4>API</h4></a></li>
                    <li><a href="#Dependencies"><h4>Dependencies</h4></a></li>
                    <li><a href="#Contact"><h4>Contact</h4></a></li>
                </ul>
            </div>
            <div class="row white" id="Projects" >
                <div class="col-xs-12">
                    <h2><strong>Your projects</strong></h2>
                    <p class="lead" >Here are all the projects you created, if you want, you can create a whole new one bly clicking
                        <a href="editor.html" >here</a>
                    </p>
                    <p class="lead" >
                        Here, you can manage the existing projects. You can delete them.
                        If you are a developper, and you want to create your own plugin for the editor,
                        you can see the <a href="documentation.html">documentation</a><br/>
                    </p>
                    <?php if (count($projects) > 0): ?>
                        <p class="lead" >Or you can choose one the projects below</p>
                        <div class="col-xs-12 col-sm-6">
                            <div class="list-group list-unstyled">
                                <?php
                                foreach ($projects as $proj) :
                                    ?>
                                    <li class="btn-group" >
                                        <a class="btn btn-default btn-left" href="editor.html#<?php echo $proj ?>" ><?php echo "$proj" ?></a>
                                        <a class="btn btn-warning btn-right" id="remove_<?php echo "$proj" ?>" ><i class="glyphicon glyphicon-trash"> </i> Delete</a>                            

                                    </li>
                                <?php endforeach; ?>
                            </div>
                        </div>
                        <?php
                    endif;
                    ?>
                    <p class="lead" >
                        Once you're in the editor, you can check for some help in the part called 'help'.
                        If you have some trouble while creating your page, don't hesitate to contact us,

                    </p>
                </div>
            </div>
            <div class="row fill transparent no-lightbox" id="Localisation" >
                <div class="col-xs-12">
                    <h2><strong>Localisation</strong></h2>
                </div>
                <div class='col-sm-6 col-xs-12 fill text-center' id="map_container" >
                    <div class="col-xs-12 text-center fill" id="map"></div>
                    <p>Right click on the map to set the origin point</p>
                </div>
                <div class="col-xs-12 col-sm-6" id="map_direction" >
                    <p class="lead text-justify" >
                        Weasywig is situated in France.
                        Because the fondator is french and from Savoie,
                        he decided to implent his company in the same region.
                        That is not preventing the company to be world-known. Because all the job they do is thanks 
                        to internet.<br/>
                        The company is developping websites for start-up. Because developping a good website is 
                        a whole job, and that it need a team and professionals, we propose our services to start-up who
                        don't have the time and/or the people to develop websites and we do it for them.<br/>
                        But a lot of company just wanted a simple single page for their websites. Of course, this job
                        was really easy for us. But to help start-up creating their own websites without any knowlegdes
                        in CSS/HTML, we created an editor that lets you create single pages.    
                    </p>
                </div>

            </div>
            <div class="row fill white" id="API">
                <div class="col-xs-12">
                    <h2><strong>Programmable API</strong></h2>
                </div>
                <div class="col-xs-12 col-sm-6">
                    <p class="lead text-justify">
                        We know that nothing is perfect. Morever when its about computing. So we decided to create 
                        and easy-to-use API. You can access the API documentation just by clicking <a href="documentation.html">here</a>.<br/>
                        This documentation will help you to understand how the editor is working. And so, if you think
                        you have enought knowledge in javascript, you can developp your own plugins to add somes elements
                        to the editor.
                    </p>
                </div>
                <div class="hidden-xs col-sm-6">
                    <a href="documentation.html">
                        <img class="img-responsive" src="assets/images/home/api.png" />
                    </a> 
                </div>
            </div>
            <div class="row fill transparent" id="Dependencies" >
                <div class="col-xs-12">
                    <h2><strong>Dependencies</strong></h2>
                </div>
                <div class="col-xs-6 text-center gallery">
                    <div class="col-xs-12">
                        <!--<img title="Mousetrap" class="img-responsive" src="assets/images/home/mousetrap.png" />-->
                        <object width="100%" hidden="" type="image/svg+xml" data="assets/svg/mousetrap.svg"></object>
                        <object width="100%" hidden="" type="image/svg+xml" data="assets/svg/underscore.svg" ></object>
                        <img title="Bootstrap"  src="assets/images/home/bootstrap.png" class="img-responsive" /> 
                        <img title="jQuery"  src="assets/images/home/jquery.png" />
                        <img title="jQueryUi" src="assets/images/home/jquery_ui.png" />
                    </div>
                </div>
                <div class="col-xs-6">
                    <p class="lead" >
                        A lot of usefull frameworks and library exists in compuing. Morever in javascript.
                        We decided to choose jQuery for the DOM manipulation. jQueryUI is to create user-friendly
                        interfaces. Bootstrap is THE css library reference. UnderscoreJs is to do data-processing in
                        javascript. And mousetrap is to handle the keyboards shortcuts.
                    </p>
                </div>
            </div>
            <div class="row fill white" id="Contact">
                <div class="col-xs-12">
                    <h2><strong>Contact us</strong></h2>
                </div>
                <div class="col-xs-12 col-sm-6 lead">
                    <p>You can contact us by phone :</p>
                    <p><b>06.12.34.45.78</b></p>
                    <p>You can also contact us by mail :</p>
                    <p><b>contact@weasywig.com</b></p>
                    <p>Even better, write us a letter at</p>
                    <p>
                        <b>La catina</b><br/>
                        <b>73800 Montmélian</b>
                    </p>
                </div>
                <div class="col-xs-12 col-sm-6 big-glyphicon text-center">
                    <object hidden="" type="image/svg+xml" data="assets/svg/contact.svg"></object>
                </div>
            </div>
            <div class="col-xs-12 text-center" id="to_top" >
                <a href="#Top">
                    <p>
                        <i class="glyphicon glyphicon-chevron-up" ></i>
                    </p>
                    <p>Back to top</p>
                </a>
            </div>
            <footer class="row" >
                <div class="col-xs-12 col-sm-4">
                    <p>Weasywig</p>
                    <b>weasywig @ 2015</b>
                </div>
                <div class="col-xs-12 col-sm-4">
                    <ul class="list-unstyled" > 
                        <li>
                            <i class="glyphicon glyphicon-map-marker"></i>
                            La catina - 73800 - Montémlian
                        </li>
                        <li>
                            <i class="glyphicon glyphicon-phone"></i>
                            <b>06.12.34.45.78</b>
                        </li>
                        <li>
                            <i class="glyphicon glyphicon-envelope"></i>
                            <b>support@weasywig.com</b>
                        </li>
                    </ul>
                </div>
                <div class="col-xs-12 col-sm-4">
                    <p><strong>About the company</strong></p>
                    <p>
                        Weasywig is a company based in France. The company is
                        specialized in websites productions.
                    </p>
                </div>
            </footer>
        </div>
        <script type="text/javascript" src="assets/js/home/home.js"></script>
        <!--Google maps script-->
        <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB4wcYndpXCDGPxRRm5r5yhIJOfoyE8Fi8&callback=initMap"></script>

        <!--Background animation script-->
<!--        <script type="text/javascript" src="assets/js/home/main.js"></script>
        <script type="text/javascript" src="assets/js/home/circle.js"></script>-->

    </body>
</html>
