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

/* @help_topics/statistics.tracking_popular_content.html.twig */
class __TwigTemplate_8b2590bfd87a90015a7747c838d48f00 extends Template
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
        // line 8
        ob_start(function () { return ''; });
        echo t("Statistics", array());
        $context["statistics_settings_link_text"] = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        // line 9
        ob_start(function () { return ''; });
        echo t("Permissions", array());
        $context["permissions_link_text"] = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        // line 10
        $context["statistics_settings_link"] = $this->extensions['Drupal\Core\Template\TwigExtension']->renderVar($this->extensions['Drupal\help_topics\HelpTwigExtension']->getRouteLink($this->sandbox->ensureToStringAllowed(($context["statistics_settings_link_text"] ?? null), 10, $this->source), "statistics.settings"));
        // line 11
        $context["permissions_link"] = $this->extensions['Drupal\Core\Template\TwigExtension']->renderVar($this->extensions['Drupal\help_topics\HelpTwigExtension']->getRouteLink($this->sandbox->ensureToStringAllowed(($context["permissions_link_text"] ?? null), 11, $this->source), "user.admin_permissions"));
        // line 12
        echo "<h2>";
        echo t("Goal", array());
        echo "</h2>
<p>";
        // line 13
        echo t("Configure and display tracking of how many times content has been viewed on your site, assuming that the core Statistics module is currently installed.", array());
        echo "</p>
<h2>";
        // line 14
        echo t("What are the options for displaying popularity tracking?", array());
        echo "</h2>
<p>";
        // line 15
        echo t("You can display a <em>content hits</em> counter of how many times a content item has been viewed, at the bottom of content item pages. You can also place a <em>Popular content</em> block in a region of your theme, which shows a list of the most popular and most recently-viewed content.", array());
        echo "</p>
<h2>";
        // line 16
        echo t("Steps", array());
        echo "</h2>
<ol>
  <li>";
        // line 18
        echo t("In the <em>Manage</em> administrative menu, navigate to <em>Configuration</em> &gt; <em>System</em> &gt; <em>@statistics_settings_link</em>.", array("@statistics_settings_link" => ($context["statistics_settings_link"] ?? null), ));
        echo "</li>
  <li>";
        // line 19
        echo t("Check <em>Count content views</em> and click <em>Save configuration</em>.", array());
        echo "</li>
  <li>";
        // line 20
        echo t("In the <em>Manage</em> administrative menu, navigate to <em>People</em> &gt; <em>@permissions_link</em>.", array("@permissions_link" => ($context["permissions_link"] ?? null), ));
        echo "</li>
  <li>";
        // line 21
        echo t("In the <em>Statistics</em> section, check or uncheck the <em>View content hits</em> permission for each role. Click <em>Save permissions</em>.", array());
        echo "</li>
  <li>";
        // line 22
        echo t("Optionally, in the <em>Manage</em> administrative menu, navigate to <em>Structure</em> &gt; <em>Block layout</em>. Place the <em>Popular content</em> block in a region in your theme (you will need to have the core Block module installed; see related topic for more details on block placement).", array());
        echo "</li>
</ol>";
    }

    public function getTemplateName()
    {
        return "@help_topics/statistics.tracking_popular_content.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  89 => 22,  85 => 21,  81 => 20,  77 => 19,  73 => 18,  68 => 16,  64 => 15,  60 => 14,  56 => 13,  51 => 12,  49 => 11,  47 => 10,  43 => 9,  39 => 8,);
    }

    public function getSourceContext()
    {
        return new Source("", "@help_topics/statistics.tracking_popular_content.html.twig", "/var/www/html/web/core/modules/statistics/help_topics/statistics.tracking_popular_content.html.twig");
    }
    
    public function checkSecurity()
    {
        static $tags = array("set" => 8, "trans" => 8);
        static $filters = array("escape" => 18);
        static $functions = array("render_var" => 10, "help_route_link" => 10);

        try {
            $this->sandbox->checkSecurity(
                ['set', 'trans'],
                ['escape'],
                ['render_var', 'help_route_link']
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
