<?xml version="1.0" encoding="UTF-8"?>
<!-- body.xsl
    Created: 2007-11-21 by jcr
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
    <xsl:template match="chapter">
        <xsl:call-template name="nav-bar"></xsl:call-template>
        <a name="{generate-id()}"/>
        <xsl:apply-templates></xsl:apply-templates>
        <xsl:call-template name="nav-bar"></xsl:call-template>
    </xsl:template>
    
    <xsl:template match="section|subsection|subsubsection">
        <a name="{generate-id()}"/>
        <xsl:apply-templates></xsl:apply-templates>
    </xsl:template>
    
    <xsl:template match="chapter/title">
        <h1>
            <xsl:number count="chapter"></xsl:number>
            <xsl:text>. </xsl:text>
            <xsl:value-of select="."></xsl:value-of>
        </h1>
    </xsl:template>
    
    <xsl:template match="section/title">
        <h2>
            <xsl:number count="chapter|section" level="multiple"></xsl:number>
            <xsl:text>. </xsl:text>
            <xsl:value-of select="."></xsl:value-of>
        </h2>
    </xsl:template>
    
    <xsl:template match="subsection/title">
        <h3>
            <xsl:number count="chapter|section|subsection" level="multiple"></xsl:number>
            <xsl:text>. </xsl:text>
            <xsl:value-of select="."></xsl:value-of>
        </h3>
    </xsl:template>
    
    <xsl:template match="subsubsection/title">
        <h3>
            <xsl:number count="chapter|section|subsection|subsubsection" level="multiple"></xsl:number>
            <xsl:text>. </xsl:text>
            <xsl:value-of select="."></xsl:value-of>
        </h3>
    </xsl:template>
    
    <xsl:template name="nav-bar">
        <hr/>
        <table width="100%">
            <tr>
                <td align="left">Anterior</td>
                <td align="center"><a href="#indice">Índice</a></td>
                <td align="right">Próximo</td>
            </tr>
        </table>
        <hr/>
    </xsl:template>
</xsl:stylesheet>
