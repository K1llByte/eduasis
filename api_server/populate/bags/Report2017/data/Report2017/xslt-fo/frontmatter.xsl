<?xml version="1.0" encoding="UTF-8"?>
<!-- frontmatter.xsl
    Created: 2007-11-19 by jcr
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0"
    xmlns:r="http://xml.di.uminho.pt/report2007">

    <xsl:template match="frontmatter">
        <center>
        <h1><xsl:value-of select="title"></xsl:value-of></h1>
        <xsl:if test="subtitle">
            <xsl:value-of select="subtitle"></xsl:value-of>
        </xsl:if>
        <xsl:apply-templates select="authors"></xsl:apply-templates>
        <h3><xsl:value-of select="date"></xsl:value-of></h3>
        </center>
        <xsl:apply-templates select="abstract"></xsl:apply-templates>
        <xsl:if test="toc">
            <xsl:call-template name="toc"></xsl:call-template>
        </xsl:if>
    </xsl:template>
    
    <xsl:template match="author">
        <h3><xsl:value-of select="name"></xsl:value-of></h3>
    </xsl:template>
    
    <xsl:template match="abstract">
        <table align="center" width="80%" style="border-left: 1px #AAAAAA solid;
            border-top: 1px #AAAAAA solid;
            border-right: 2px #444444 solid;
            border-bottom: 2px #444444 solid;
            background-color: #EFEFEF;
            padding: 0.5em;
            text-align: left;">
            <tr>
                <td>
                    <h2 align="left">Abstract</h2>
                    <xsl:apply-templates></xsl:apply-templates>  
                </td>
            </tr>
        </table>
    </xsl:template>
    
    <!-- Templates for the Table of Contents -->
    
    <xsl:template name="toc">
        <h2><a name="indice"/>Índice</h2>
        <xsl:apply-templates select="/r:report/body" mode="toc"></xsl:apply-templates>
    </xsl:template>
    
    <xsl:template match="chapter|section|subsection|subsubsection" mode="toc">
        <a href="#{generate-id()}">
        <xsl:number count="chapter|section|subsection|subsubsection" level="multiple" />
        <xsl:text> - </xsl:text>
        <xsl:value-of select="title"/>
        </a>
        <br/>
        <xsl:apply-templates mode="toc"></xsl:apply-templates>
    </xsl:template>
    
    <xsl:template match="text()" priority="-1" mode="toc"></xsl:template>

</xsl:stylesheet>
