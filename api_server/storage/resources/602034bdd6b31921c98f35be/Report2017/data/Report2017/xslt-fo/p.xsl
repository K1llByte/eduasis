<?xml version="1.0" encoding="UTF-8"?>
<!-- p.xsl
    Created: 2007-11-19 by jcr
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0"
    xmlns:p="http://xml.di.uminho.pt/paragraph2007">
    
    <xsl:template match="p:p">
        <p>
            <xsl:apply-templates></xsl:apply-templates>
        </p>
    </xsl:template>
    
    <xsl:template match="b">
        <b>
            <xsl:apply-templates></xsl:apply-templates>
        </b>
    </xsl:template>
    
    <xsl:template match="i">
        <b>
            <xsl:apply-templates></xsl:apply-templates>
        </b>
    </xsl:template>
    
    <xsl:template match="u">
        <b>
            <xsl:apply-templates></xsl:apply-templates>
        </b>
    </xsl:template>
    
    <xsl:template match="acronym">
        <xsl:choose>
            <xsl:when test="description">
                <xsl:value-of select="description"></xsl:value-of>
                <xsl:text> </xsl:text>
                (<xsl:value-of select="term"></xsl:value-of>)
                <xsl:text> </xsl:text>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="term"></xsl:value-of>
            </xsl:otherwise>
        </xsl:choose>   
    </xsl:template>
    
    <xsl:template match="inlinecode">
        <i><xsl:value-of select="."></xsl:value-of></i>
    </xsl:template>

</xsl:stylesheet>
