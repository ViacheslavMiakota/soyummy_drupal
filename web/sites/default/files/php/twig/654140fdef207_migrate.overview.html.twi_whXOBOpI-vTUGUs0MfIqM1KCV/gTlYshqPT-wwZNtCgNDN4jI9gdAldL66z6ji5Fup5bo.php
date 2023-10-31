<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Extension\SandboxExtension;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;

/* @help_topics/migrate.overview.html.twig */
class __TwigTemplate_a622dbf41b07a2b08e384fe2a065b980 extends Template
{
    private $source;
    private $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->parent = false;

        $this->blocks = [
        ];
        $this->sandbox = $this->env->getExtension('\Twig\Extension\SandboxExtension');
        $this->checkSecurity();
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 5
        echo "<h2>";
        echo t("What are updating, upgrading, and migrating?", array());
        echo "</h2>
<p>";
        // line 6
        echo t("<em>Updating</em> is the process of changing from one minor version of the software to a newer version, such as from version 8.3.4 to 8.3.5, or 8.3.5 to 8.4.0. Starting with version 8.x, you can also update to major versions 9, 10, and beyond if your add-on modules, themes, and install profiles are compatible. <em>Upgrading</em> is the process of changing from an older major version of the software to a newer version, such as from version 7 to 8. <em>Migrating</em> is the process of importing data into a site.", array());
        echo "</p>
<p>";
        // line 7
        echo t("To upgrade a site from Drupal 6 or 7 to Drupal 8 or later, keeping the content and configuration the same, you will install the new version of the software and add-on modules and themes in a new site, and then migrate the content and other data from your old site into the new site.", array());
        echo "</p>
<h2>";
        // line 8
        echo t("Overview of Migrating", array());
        echo "</h2>
<p>";
        // line 9
        echo t("You can use the <em>Migration</em> group of modules to perform the migration step of upgrading from Drupal 6 or 7 to Drupal 8 or later, as well as other migrations. These modules also provide APIs that can be used by programmers to write custom software for migrations. Here are the functions of the core migration modules:", array());
        echo "</p>
<dl>
<dt>";
        // line 11
        echo t("Migrate", array());
        echo "</dt>
<dd>";
        // line 12
        echo t("Provides the underlying API for migrating data.", array());
        echo "</dd>
<dt>";
        // line 13
        echo t("Migrate Drupal", array());
        echo "</dt>
<dd>";
        // line 14
        echo t("Provides data migration from older versions of the Drupal software into a new site.", array());
        echo "</dd>
<dt>";
        // line 15
        echo t("Migrate Drupal UI", array());
        echo "</dt>
<dd>";
        // line 16
        echo t("Provides a user interface for performing data migration from older versions of the Drupal software into a new site.", array());
        echo "</dd>
</dl>
<p>";
        // line 18
        echo t("If the source of the data you want to migrate is a different content management system, or if the data source is a Drupal site that was built using contributed modules that the core migration modules do not support, then you will also need one or more contributed or custom modules in order to migrate your data.", array());
        echo "</p>
<h2>";
        // line 19
        echo t("Additional Resources", array());
        echo "</h2>
<ul>
<li>";
        // line 21
        echo t("<a href=\"https://www.drupal.org/docs/upgrading-drupal\">Upgrading Drupal</a>", array());
        echo "</li>
</ul>";
    }

    public function getTemplateName()
    {
        return "@help_topics/migrate.overview.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  95 => 21,  90 => 19,  86 => 18,  81 => 16,  77 => 15,  73 => 14,  69 => 13,  65 => 12,  61 => 11,  56 => 9,  52 => 8,  48 => 7,  44 => 6,  39 => 5,);
    }

    public function getSourceContext()
    {
        return new Source("", "@help_topics/migrate.overview.html.twig", "/var/www/html/web/core/modules/help_topics/help_topics/migrate.overview.html.twig");
    }
    
    public function checkSecurity()
    {
        static $tags = array("trans" => 5);
        static $filters = array();
        static $functions = array();

        try {
            $this->sandbox->checkSecurity(
                ['trans'],
                [],
                []
            );
        } catch (SecurityError $e) {
            $e->setSourceContext($this->source);

            if ($e instanceof SecurityNotAllowedTagError && isset($tags[$e->getTagName()])) {
                $e->setTemplateLine($tags[$e->getTagName()]);
            } elseif ($e instanceof SecurityNotAllowedFilterError && isset($filters[$e->getFilterName()])) {
                $e->setTemplateLine($filters[$e->getFilterName()]);
            } elseif ($e instanceof SecurityNotAllowedFunctionError && isset($functions[$e->getFunctionName()])) {
                $e->setTemplateLine($functions[$e->getFunctionName()]);
            }

            throw $e;
        }

    }
}
