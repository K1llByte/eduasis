<?xml version="1.0" encoding="UTF-8"?>
<!-- backmatter.xsl
       Created: 2007-11-19 by jcr
-->

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
    
    <xsl:template match="bibliography">
        <h1>Bibliografia</h1>
        <xsl:apply-templates></xsl:apply-templates>
    </xsl:template>
    
    <xsl:template match="bibitem">
        <a name="{@id}"/>
        [<b><xsl:value-of select="citkey"></xsl:value-of></b>]
        <xsl:text> </xsl:text>
        <xsl:value-of select="citation"></xsl:value-of>
    </xsl:template>

</xsl:stylesheet>
