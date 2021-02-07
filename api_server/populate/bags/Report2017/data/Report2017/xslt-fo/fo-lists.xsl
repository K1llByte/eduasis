<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0"
    xmlns:fo="http://www.w3.org/1999/XSL/Format"
    xmlns:r="http://xml.di.uminho.pt/report2007"
    xmlns:p="http://xml.di.uminho.pt/paragraph2007"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://xml.di.uminho.pt/report2007 file:report.xsd">

    <xsl:template match="ulist|olist">
        <fo:list-block 
            provisional-distance-between-starts="18pt"
            provisional-label-separation="3pt"
            space-after="1cm">
            
            <xsl:apply-templates/>
        </fo:list-block>
    </xsl:template>
    
    <xsl:template match="ulist/item">
        <fo:list-item space-after=".5cm">
            <fo:list-item-label end-indent="label-end()">
                <fo:block>&#x2022;</fo:block>
            </fo:list-item-label>
            <fo:list-item-body start-indent="body-start()">
                <fo:block>
                    <xsl:apply-templates/>
                </fo:block>
            </fo:list-item-body>
        </fo:list-item>
    </xsl:template>
    
    <xsl:template match="olist/item">
        <fo:list-item space-after=".5cm">
            <fo:list-item-label end-indent="label-end()">
                <fo:block>
                    <xsl:number count="item" level="single"/>
                </fo:block>
            </fo:list-item-label>
            <fo:list-item-body start-indent="body-start()">
                <fo:block>
                    <xsl:apply-templates/>
                </fo:block>
            </fo:list-item-body>
        </fo:list-item>
    </xsl:template>
    
    <xsl:template match="dlist">
        <fo:list-block 
            provisional-distance-between-starts="180pt"
            provisional-label-separation="10pt"
            space-after="1cm">
            <xsl:apply-templates select="dt"/>
        </fo:list-block>
    </xsl:template>

    <xsl:template match="dt">
        <fo:list-item space-after=".5cm">
            <fo:list-item-label end-indent="label-end()">
                <fo:block>
                    <xsl:value-of select="."></xsl:value-of>
                </fo:block>
            </fo:list-item-label>
            <xsl:apply-templates select="following-sibling::dd[1]"/>
        </fo:list-item>
    </xsl:template>
    
    <xsl:template match="dd">
        <fo:list-item-body start-indent="body-start()">
            <fo:block>
                <xsl:apply-templates/>
            </fo:block>
        </fo:list-item-body>
    </xsl:template>

</xsl:stylesheet>
