<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0"
    xmlns:fo="http://www.w3.org/1999/XSL/Format"
    xmlns:r="http://xml.di.uminho.pt/report2007"
    xmlns:p="http://xml.di.uminho.pt/paragraph2007"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://xml.di.uminho.pt/report2007 file:report.xsd">

    <xsl:variable name="figwidth" select="200"/>
    
    <xsl:template match="graphic">
        <fo:external-graphic 
            src="url({@path})" 
            width="{@figwidth}px"/>
    </xsl:template>
    
    <xsl:template match="figure">
        <fo:block font="Arial" text-align="center" font-size="12pt" font-weight="600"
            space-after="1cm" space-before="1cm">
            <xsl:apply-templates select="graphic"/>
            <xsl:apply-templates select="caption"/>
        </fo:block>
    </xsl:template>
    
    <xsl:template match="caption">
        <fo:block>
            <fo:inline font-weight="900">
                <xsl:text>Figure: </xsl:text>
            </fo:inline>
            <fo:inline><xsl:apply-templates/></fo:inline>
        </fo:block>
    </xsl:template>

</xsl:stylesheet>
