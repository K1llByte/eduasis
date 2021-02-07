<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0"
    xmlns:fo="http://www.w3.org/1999/XSL/Format"
    xmlns:r="http://xml.di.uminho.pt/report2007"
    xmlns:p="http://xml.di.uminho.pt/paragraph2007"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://xml.di.uminho.pt/report2007 file:report.xsd">
    
    <xsl:template match="frontmatter">
        <fo:block font="Helvetica" text-align="center" font-size="36pt" font-weight="600"
            space-after="1cm" space-before="1cm">
            <xsl:value-of select="title"/>
            <xsl:if test="subtitle">
                <fo:block font-size="32pt" font="Times">
                    <xsl:value-of select="subtitle"/>
                </fo:block>
            </xsl:if>
        </fo:block>
        <xsl:apply-templates select="authors"/>
        <xsl:apply-templates select="date"/>
    </xsl:template>
    
    <xsl:template match="author">
        <fo:block font="Helvetica" text-align="center" font-size="24pt" font-weight="normal"
            space-before="1cm">
            <xsl:value-of select="name"/>
        </fo:block>
        <fo:block font="Helvetica" text-align="center" font-size="20pt" font-weight="normal">
            <xsl:value-of select="url"/>
        </fo:block>
        <fo:block font="Helvetica" text-align="center" font-size="20pt" font-weight="normal">
            <xsl:value-of select="affil"/>
        </fo:block>
    </xsl:template>
    
    <xsl:template match="date">
        <fo:block font="Helvetica" text-align="center" font-size="24pt" font-weight="800"
            space-before="2cm">
            <xsl:value-of select="."/>
        </fo:block>
    </xsl:template>
    
    <xsl:template match="abstract">
        <fo:block font="Arial" text-align="right" font-size="24pt" font-weight="600"
            space-after="1cm" space-before="1cm">
            <fo:inline color="gray" font-size="30pt">R</fo:inline>esumo
        </fo:block>
        <fo:block margin="1.5cm">
            <fo:block
                border="thin gray groove"
                border-before-width.conditionality="discard"
                border-after-width.conditionality="discard"
                padding="2cm" text-align="justify">    
                <xsl:apply-templates/>
            </fo:block>
        </fo:block>
    </xsl:template>
    
</xsl:stylesheet>
