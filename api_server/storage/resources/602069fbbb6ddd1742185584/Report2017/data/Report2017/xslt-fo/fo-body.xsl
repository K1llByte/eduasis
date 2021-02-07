<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0"
    xmlns:fo="http://www.w3.org/1999/XSL/Format"
    xmlns:r="http://xml.di.uminho.pt/report2007"
    xmlns:p="http://xml.di.uminho.pt/paragraph2007"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://xml.di.uminho.pt/report2007 file:report.xsd">

    <xsl:template match="body">
        <xsl:apply-templates/>
    </xsl:template>
    
    <xsl:template match="chapter">
        <fo:page-sequence master-reference="body-sequence">
            <fo:flow flow-name="xsl-region-body">
                <xsl:apply-templates/>
            </fo:flow>
        </fo:page-sequence>
    </xsl:template>
    
    <xsl:template match="chapter/title">
        <fo:block font="Arial" text-align="right" font-size="30pt" font-weight="600"
            space-after="1cm" space-before="1cm">
            <fo:inline color="gray" font-size="36pt">
                <xsl:number count="chapter|section|subsection|subsubsection" level="multiple"/>
                <xsl:text>. </xsl:text>
            </fo:inline>
            <xsl:value-of select="."/>
        </fo:block>
    </xsl:template>
    
    <xsl:template match="section/title">
        <fo:block font="Arial" text-align="right" font-size="24pt" font-weight="600"
            space-after="1cm" space-before="1cm">
            <fo:inline color="gray" font-size="30pt">
                <xsl:number count="chapter|section|subsection|subsubsection" level="multiple"/>
                <xsl:text>. </xsl:text>
            </fo:inline>
            <xsl:value-of select="."/>
        </fo:block>
    </xsl:template>
    
    <xsl:template match="subsection/title">
        <fo:block font="Arial" text-align="right" font-size="18pt" font-weight="600"
            space-after="1cm" space-before="1cm">
            <fo:inline color="gray" font-size="24pt">
                <xsl:number count="chapter|section|subsection|subsubsection" level="multiple"/>
                <xsl:text>. </xsl:text>
            </fo:inline>
            <xsl:value-of select="."/>
        </fo:block>
    </xsl:template>
    
    <xsl:template match="subsubsection/title">
        <fo:block font="Arial" text-align="right" font-size="12pt" font-weight="600"
            space-after="1cm" space-before="1cm">
            <fo:inline color="gray" font-size="18pt">
                <xsl:number count="chapter|section|subsection|subsubsection" level="multiple"/>
                <xsl:text>. </xsl:text>
            </fo:inline>
            <xsl:value-of select="."/>
        </fo:block>
    </xsl:template>
    
    <xsl:template match="p:p">
        <fo:block line-height="1.5" text-align="justify" space-after=".5cm" font-size="12pt">
            <xsl:apply-templates/>
        </fo:block>    
    </xsl:template>
  
  <!-- Emphasize: Bold, Italic, Underline ................................. -->
  
    <xsl:template match="b">
        <fo:inline font-weight="bold">
            <xsl:value-of select="."/>
        </fo:inline>
    </xsl:template>
    
    <xsl:template match="i">
        <fo:inline font-style="italic">
            <xsl:value-of select="."/>
        </fo:inline>
    </xsl:template>
    
    <xsl:template match="u">
        <fo:inline text-decoration="underline">
            <xsl:value-of select="."/>
        </fo:inline>
    </xsl:template>
    
    <xsl:template match="inlinecode">
        <fo:inline font-family="monospace">
            <xsl:value-of select="."/>
        </fo:inline>
    </xsl:template>
    
    <!--xsl:template priority="-1" match="text()"/-->
    
</xsl:stylesheet>
