<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0"
    xmlns:r="http://xml.di.uminho.pt/report2007"
    xmlns:p="http://xml.di.uminho.pt/paragraph2007">
    
    <xsl:output method="html" encoding="ISO-8859-1" indent="yes"/>
    
    <xsl:include href="coverpage.xsl"/>
    <xsl:include href="bodypages.xsl"/>
    <xsl:include href="paragraph.xsl"/>
    <xsl:include href="lists.xsl"/>
    <xsl:include href="floats.xsl"/>
    
    <xsl:param name="main">index</xsl:param>
    
    <xsl:template match="/">
        <xsl:result-document href="html/{$main}.html" method="html" indent="yes">
            <html>
                <head>
                    <link rel="stylesheet" href="w3.css" type="text/css"/>
                    <!--link rel="stylesheet" href="report2007.css" type="text/css"/-->
                </head>
                <body>
                    <xsl:call-template name="coverpage"/>
                    <xsl:call-template name="bodypages"/>
                    <xsl:call-template name="backpages"/>
                </body>
            </html>
        </xsl:result-document>
    </xsl:template>

</xsl:stylesheet>
