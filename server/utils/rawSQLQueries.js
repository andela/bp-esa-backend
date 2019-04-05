const sqlAutomationRawQuery = 'SELECT a.id FROM automation as a '
      + `
        left join 
        (SELECT 
        "automationId", 
        SUM(
            (
                CASE 
                    WHEN status=? THEN 0
                    ELSE 1
                END
            )
        )
        as status
        
        from "slackAutomation"
        group by "automationId"
        ) as s
        on "s"."automationId"="a"."id"
        
        left join 
        (SELECT 
        "automationId", 
        SUM(
            (
                CASE 
                    WHEN status=? THEN 0
                    ELSE 1
                END
            )
        )
        as status
        
        from "emailAutomation"
        group by "automationId"
        ) as e
        on "e"."automationId"="a"."id"
        left join 
        (SELECT 
        "automationId", 
        SUM(
            (
                CASE 
                    WHEN status=? THEN 0
                    ELSE 1
                END
            )
        )
        as status
        
        from "freckleAutomation"
        group by "automationId"
        ) as f
        on "f"."automationId"="a"."id"
        where 1=1
      `;


export const queryCounter = 'SELECT COUNT(a.id) as count FROM automation as a '
      + `
        left join 
        (SELECT 
        "automationId", 
        SUM(
            (
                CASE 
                    WHEN status=? THEN 0
                    ELSE 1
                END
            )
        )
        as status
        
        from "slackAutomation"
        group by "automationId"
        ) as s
        on "s"."automationId"="a"."id"
        
        left join 
        (SELECT 
        "automationId", 
        SUM(
            (
                CASE 
                    WHEN status=? THEN 0
                    ELSE 1
                END
            )
        )
        as status
        
        from "emailAutomation"
        group by "automationId"
        ) as e
        on "e"."automationId"="a"."id"
        left join 
        (SELECT 
        "automationId", 
        SUM(
            (
                CASE 
                    WHEN status=? THEN 0
                    ELSE 1
                END
            )
        )
        as status
        
        from "freckleAutomation"
        group by "automationId"
        ) as f
        on "f"."automationId"="a"."id"
        where 1=1
      `;

export default sqlAutomationRawQuery;
