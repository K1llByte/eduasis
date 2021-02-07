<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0"
    xmlns:r="http://xml.di.uminho.pt/report2007"
    xmlns:p="http://xml.di.uminho.pt/paragraph2007">
    
    <xsl:key name="refs" match="*[@id]" use="@id"/>
    <xsl:key name="bibrefs" match="bibitem" use="@id"/>
    
    <xsl:template match="p:p">
        <div class="w3-container w3-padding">
            <xsl:apply-templates/>
        </div>
    </xsl:template>
    
    <xsl:template match="b">
        <div class="b">
            <xsl:apply-templates/>
        </div>
    </xsl:template>
    
    <xsl:template match="i">
        <div class="i">
            <xsl:apply-templates/>
        </div>
    </xsl:template>
    
    <xsl:template match="u">
        <div class="u">
            <xsl:apply-templates/>
        </div>
    </xsl:template>
    
    <xsl:template match="inlinecode">
        <div class="inlinecode">
            <xsl:value-of select="."/>
        </div>
    </xsl:template>
    
    <xsl:template match="ref">
        <xsl:apply-templates select="key('refs',@target)" mode="ref"/>
    </xsl:template>
    
    <xsl:template match="citref">
        <a href="#{@target}">[<xsl:value-of select="key('bibrefs',@target)/citkey"/>]</a>
    </xsl:template>
    
    <xsl:template match="figure" mode="ref">
        <a href="#{generate-id()}"><xsl:number count="//figure" level="any"/></a>
    </xsl:template>
    
    <xsl:template match="chapter" mode="ref">
        <a href="#{generate-id()}"><xsl:number count="chapter" level="any"/></a>
    </xsl:template>

</xsl:stylesheet>
