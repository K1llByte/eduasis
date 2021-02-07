<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0"
    xmlns:r="http://xml.di.uminho.pt/report2007"
    xmlns:p="http://xml.di.uminho.pt/paragraph2007">
    
    <xsl:template match="figure">
        <div class="figure" align="center">
            <a name="{generate-id()}"/>
            <img src="{graphic/@path}" width="{graphic/@width}"/>
            <div class="fcaption" align="center">
                <xsl:text>Figura </xsl:text>
                <xsl:number count="figure" level="any"/>
                <xsl:text>: </xsl:text>
                <xsl:value-of select="caption"/>
            </div>
        </div>
    </xsl:template>

</xsl:stylesheet>
